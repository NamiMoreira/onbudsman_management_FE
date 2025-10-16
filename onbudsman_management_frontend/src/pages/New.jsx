import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function New() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reanalise: false,
    classificacao_id: 1,
    unidade_id: 1,
    descricao: "",
    cartao_beneficiario: "",
    manifestacao_ant: "",
    identificacao_id: 1,
    forma_resposta_id: 1,
    assunto_id: 1,
    sub_assunto_id: 1,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    canal_id: 1,
  });

  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("É necessário aceitar as políticas de privacidade.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.30.26:8090/ocurrence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao enviar formulário");

      const data = await response.json();
      navigate("/response", { state: { data } });
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao enviar o formulário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Nova Ocorrência</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Nome */}
        <div className="col-md-6">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cartão do Beneficiário */}
        <div className="col-md-6">
          <label className="form-label">Cartão do Beneficiário</label>
          <input
            type="text"
            className="form-control"
            name="cartao_beneficiario"
            value={formData.cartao_beneficiario}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* CPF */}
        <div className="col-md-6">
          <label className="form-label">CPF</label>
          <input
            type="text"
            className="form-control"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>

        {/* Telefone */}
        <div className="col-md-6">
          <label className="form-label">Telefone</label>
          <input
            type="text"
            className="form-control"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        {/* Reanálise */}
        <div className="col-md-6">
          <label className="form-label">Reanálise</label>
          <select
            className="form-select"
            name="reanalise"
            value={formData.reanalise}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        {/* Selects numéricos */}
        <div className="col-md-4">
          <label className="form-label">Classificação</label>
          <select
            className="form-select"
            name="classificacao_id"
            value={formData.classificacao_id}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="1">Urgente</option>
            <option value="1">Normal</option>
            <option value="1">Baixa Prioridade</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Unidade</label>
          <select
            className="form-select"
            name="unidade_id"
            value={formData.unidade_id}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="1">Unidade Central</option>
            <option value="1">Clínica Sul</option>
            <option value="1">Hospital Unimed</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Identificação</label>
          <select
            className="form-select"
            name="identificacao_id"
            value={formData.identificacao_id}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="1">Beneficiário</option>
            <option value="1">Prestador</option>
            <option value="1">Outros</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Forma de Resposta</label>
          <select
            className="form-select"
            name="forma_resposta_id"
            value={formData.forma_resposta_id}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="1">E-mail</option>
            <option value="1">Telefone</option>
            <option value="1">Carta</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Assunto</label>
          <select
            className="form-select"
            name="assunto_id"
            value={formData.assunto_id}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="1">Atendimento</option>
            <option value="1">Cobrança</option>
            <option value="1">Autorização</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Subassunto</label>
          <select
            className="form-select"
            name="sub_assunto_id"
            value={formData.sub_assunto_id}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="1">Demora no atendimento</option>
            <option value="1">Erro de fatura</option>
            <option value="1">Problema de sistema</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Canal</label>
          <select
            className="form-select"
            name="canal_id"
            value={formData.canal_id}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="1">Telefone</option>
            <option value="1">E-mail</option>
            <option value="1">Presencial</option>
          </select>
        </div>

        {/* Manifestação anterior */}
        <div className="col-md-6">
          <label className="form-label">Manifestação Anterior</label>
          <input
            type="text"
            className="form-control"
            name="manifestacao_ant"
            value={formData.manifestacao_ant}
            onChange={handleChange}
          />
        </div>

        {/* Descrição */}
        <div className="col-12">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        {/* Políticas de privacidade */}
        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              id="termsCheck"
            />
            <label className="form-check-label" htmlFor="termsCheck">
              Li e aceito as{" "}
              <a 
                href="/politicas-de-privacidade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                onClick={(e) => e.stopPropagation()}
              >
                políticas de privacidade
              </a>
            </label>
          </div>
        </div>

        {/* Botão */}
        <div className="col-12 text-center mt-3">
          <button 
            type="submit" 
            className="btn btn-success" 
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}