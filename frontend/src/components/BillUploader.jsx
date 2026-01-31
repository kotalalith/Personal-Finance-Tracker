// components/BillUploader.jsx
import React, { useState } from "react";
import axios from "axios";

export default function BillUploader({ onParsed }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const submit = async () => {
    if (!file) {
      setError("Please choose an image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post("http://localhost:5000/api/ocr/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // server returns parsed { vendor, date, total, category, rawText }
      onParsed && onParsed(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload/ocr failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Upload bill / receipt</label>
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && <img src={preview} alt="preview" className="w-48 h-auto mt-2 rounded" />}
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <button onClick={submit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Processing..." : "Upload & Scan"}
        </button>
      </div>
    </div>
  );
}
