import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Response() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  // Estados para o upload
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE_MB = 8;

  if (!data) {
    return (
      <div className="container my-5 text-center">
        <h4>Nenhum dado encontrado.</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Voltar ao início
        </button>
      </div>
    );
  }

  // Funções para o upload
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Por favor, selecione pelo menos um arquivo.");
      return;
    }

    setError("");

    try {
      const formData = new FormData();

      // Usar o protocolo que já veio da resposta anterior
      formData.append("protocol", data.protocolo);

      files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await fetch("http://192.168.30.26:8090/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log("Resposta do servidor:", responseData);

      if (!response.ok) {
        setError(responseData.status || "Erro ao enviar dados");
        return;
      }

      alert("Arquivos enviados com sucesso!");
      setFiles([]);
    } catch (err) {
      console.error("Erro no envio:", err);
      setError("Erro ao enviar dados. Verifique sua conexão e tente novamente.");
    }
  };

  return (
    <div className="container my-5">
      {/* Cabeçalho de sucesso */}
      <div className="alert alert-success text-center" role="alert">
        <h4 className="alert-heading">Solicitação registrada com sucesso!</h4>
        <p>
          <strong>Protocolo:</strong> {data.protocolo}
        </p>
        <p>
          <strong>Prazo final:</strong>{" "}
          {new Date(data.prazo_final).toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* Seção de Upload de Arquivos */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Upload de Arquivos para o Protocolo</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <strong>Protocolo Vinculado:</strong>
              </label>
              <input
                type="text"
                className="form-control"
                value={data.protocolo}
                disabled
                style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}
              />
              <div className="form-text">
                Este é o protocolo gerado automaticamente para o upload dos arquivos.
              </div>
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
              Enviar Arquivos
            </button>
          </form>

          {files.length > 0 && (
            <div className="mt-4">
              <h6>Arquivos Selecionados:</h6>
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
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Voltar à página inicial
        </button>
      </div>
    </div>
  );
}