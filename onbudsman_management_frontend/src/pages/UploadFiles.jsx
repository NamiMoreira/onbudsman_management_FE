// src/pages/DragDropUploadBootstrap.jsx
import React, { useState } from "react";

export default function DragDropUploadBootstrap() {
  const [files, setFiles] = useState([]);
  const [protocol, setProtocol] = useState("");
  const [error, setError] = useState("");

  const MAX_FILE_SIZE_MB = 8;

  const handleFiles = (selectedFiles) => {
    setError("");
    const invalidFile = Array.from(selectedFiles).find(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );

    if (invalidFile) {
      setError(`O arquivo "${invalidFile.name}" excede 8MB.`);
      return;
    }

    setFiles(Array.from(selectedFiles));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleProtocolChange = (e) => {
    setProtocol(e.target.value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!protocol) {
      setError("Por favor, insira o número do protocolo.");
      return;
    }

    if (files.length === 0) {
      setError("Por favor, selecione pelo menos um arquivo.");
      return;
    }

    setError("");

    try {
      const formData = new FormData();

      // 🔹 CORREÇÃO PRINCIPAL: usar a mesma chave que o backend espera
      formData.append("protocol", protocol);

      files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await fetch("http://192.168.30.26:8090/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (!response.ok) {
        setError(data.status || "Erro ao enviar dados");
        return;
      }

      alert("Arquivos enviados com sucesso!");
      setProtocol("");
      setFiles([]);
    } catch (err) {
      console.error("Erro no envio:", err);
      setError("Erro ao enviar dados. Verifique sua conexão e tente novamente.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Upload de Arquivos</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="protocol" className="form-label">
            Número do Protocolo
          </label>
          <input
            type="text"
            id="protocol"
            className="form-control"
            value={protocol}
            onChange={handleProtocolChange}
            placeholder="Digite o número do protocolo"
            required
          />
        </div>

        <div
          className="border rounded p-5 text-center position-relative mb-3 bg-light"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ cursor: "pointer" }}
        >
          <input
            type="file"
            multiple
            onChange={handleChange}
            className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
          />
          <div className="d-flex flex-column align-items-center justify-content-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              fill="#198754"
              className="bi bi-upload mb-3"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5-.5h4V1.5a.5.5 0 0 1 1 0v7.9h4a.5.5 0 0 1 .5.5v.6a.5.5 0 0 1-.5.5H1a.5.5 0 0 1-.5-.5v-.6z" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0L11 3.793 9.646 5.146 8.5 4.0V10.5a.5.5 0 0 1-1 0V4.0l-1.146 1.146L5 3.793l2.646-2.647z" />
            </svg>
            <p className="mb-0">Arraste e solte os arquivos aqui ou clique para selecionar</p>
            <small className="text-muted">Máximo 8MB por arquivo</small>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: "#00b050",
            color: "white",
            borderColor: "#00b050",
          }}
        >
          Enviar
        </button>
      </form>

      {files.length > 0 && (
        <div className="mt-3">
          <h5>Arquivos Selecionados:</h5>
          <ul className="list-group">
            {files.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {file.name}
                <span className="badge bg-secondary rounded-pill">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
