import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setText(data.text);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>📄 AI Document Analyzer</h1>

        <p className="message">{message}</p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={uploadFile}>🚀 Upload Document</button>

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