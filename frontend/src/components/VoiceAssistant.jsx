import React, { useState } from "react";

const VoiceAssistant = ({ onVoiceCommand }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);

      // Send to backend
      try {
        const res = await fetch("http://localhost:5000/api/voice/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        });
        const data = await res.json();
        setResponse(data.reply);

        // Call optional handler for parent component
        if (onVoiceCommand) onVoiceCommand(text, data.reply);

        // Speak out loud
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Error fetching voice response:", err);
        setResponse("Sorry, I couldn’t process that.");
      }
    };

    recognition.onerror = (err) => {
      console.error("Voice recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🎙️ FinTrack Voice Assistant</h2>
      <button
        onClick={startListening}
        className={`px-6 py-3 rounded-md text-white font-semibold transition ${
          listening ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {listening ? "Listening..." : "Ask FinTrack"}
      </button>

      {transcript && (
        <p className="mt-4 text-gray-700 dark:text-gray-300 italic">
          You said: <span className="font-semibold">“{transcript}”</span>
        </p>
      )}

      {response && (
        <p className="mt-2 text-green-700 dark:text-green-400 font-medium">
          FinTrack: {response}
        </p>
      )}
    </div>
  );
};

export default VoiceAssistant;
