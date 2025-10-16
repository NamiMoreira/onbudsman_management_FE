import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Response() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

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

      

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Voltar à página inicial
        </button>
      </div>
    </div>
  );
}