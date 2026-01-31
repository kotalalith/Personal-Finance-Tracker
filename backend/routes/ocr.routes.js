// routes/ocr.routes.js
import express from "express";
import multer from "multer";
import { createWorker } from "tesseract.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// simple category keywords map
const CATEGORY_KEYWORDS = {
  Electricity: ["bill", "electricity", "tneb", "discom", "kseb", "bpcl" /* example */],
  Rent: ["rent", "landlord", "rental"],
  Grocery: ["grocery", "supermarket", "big bazaar", "dmart", "grocery"],
  Dining: ["restaurant", "cafe", "dining", "bar", "pizza", "burger"],
  Fuel: ["petrol", "diesel", "fuel", "gas station", "hpcl", "indian oil"],
  Telecom: ["airtel", "jio", "vi", "vodafone", "phone bill"],
  Others: []
};

// tiny helpers to extract amount and date from raw text
const extractAmount = (text) => {
  // look for patterns like "Total: 1,234.56" or "Amount INR 1234.00" or numbers with currency symbol
  const amountRegex = /(?:total|amount|grand total|net total|balance due|amount paid)?[:\s]*₹?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})|[0-9]+(?:\.[0-9]{1,2}))/i;
  const m = text.match(amountRegex);
  if (m && m[1]) {
    const numStr = m[1].replace(/,/g, "");
    return parseFloat(numStr);
  }
  // fallback: largest number in text (common heuristic)
  const nums = Array.from(text.matchAll(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})|[0-9]+(?:\.[0-9]{1,2}))/g)).map(x => x[1].replace(/,/g,""));
  if (nums.length) {
    const floats = nums.map(n => parseFloat(n));
    return Math.max(...floats);
  }
  return null;
};

const extractDate = (text) => {
  // try common date formats dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd, dd MMM yyyy etc.
  const datePatterns = [
    /([0-3]?\d[\/\-][0-1]?\d[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    /([0-3]?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{4})/i
  ];
  for (const pat of datePatterns) {
    const m = text.match(pat);
    if (m) return m[1];
  }
  return null;
};

const detectVendor = (text) => {
  // find the first line(s) that look like shop name (heuristic: top line of text)
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length) {
    // often vendor appears in first 2 lines
    return lines.slice(0,2).join(" ");
  }
  return null;
};

const detectCategory = (text) => {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) return cat;
    }
  }
  return "Others";
};


// single in-memory Tesseract worker reused across requests
let workerInstance = null;
async function getWorker() {
  if (!workerInstance) {
    workerInstance = createWorker({
      logger: (m) => {} // optional logger
    });
    await workerInstance.load();
    await workerInstance.loadLanguage("eng");
    await workerInstance.initialize("eng");
  }
  return workerInstance;
}

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const worker = await getWorker();
    const { data: { text } } = await worker.recognize(req.file.buffer);

    // simple parsing
    const vendor = detectVendor(text) || "Unknown vendor";
    const rawDate = extractDate(text) || null;
    const total = extractAmount(text);
    const category = detectCategory(text);

    // Build response - you can save to DB here as a transaction
    const parsed = {
      vendor,
      date: rawDate,
      total,
      category,
      rawText: text
    };

    return res.json(parsed);
  } catch (err) {
    console.error("OCR error:", err);
    return res.status(500).json({ message: "OCR failed", error: err.message });
  }
});

export default router;
