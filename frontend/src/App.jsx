import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://document-analyzer-vs2r.onrender.com";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend connection failed");
        }
        return response.json();
      })
      .then((data) => setMessage(data.message || "Backend connected"))
      .catch(() => setMessage("Backend connection failed. Please refresh."));
  }, []);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a PDF file only.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setText("");

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "PDF upload failed");
      }

      if (data.text) {
        setText(data.text);
      } else {
        setText("No text was extracted from this PDF.");
      }
    } catch (error) {
      setText(
        `Error: ${error.message}. Please check the backend connection and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>📄 AI Document Analyzer</h1>

        <p className="message">{message}</p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            setFile(e.target.files[0] || null);
            setText("");
          }}
        />

        <button onClick={uploadFile} disabled={loading}>
          {loading ? "⏳ Processing PDF..." : "🚀 Upload Document"}
        </button>

        <textarea
          value={text}
          readOnly
          placeholder="📄 PDF text will appear here..."
        />
      </div>
    </div>
  );
}

export default App;