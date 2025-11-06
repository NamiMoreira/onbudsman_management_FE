import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function New() {
  const navigate = useNavigate();
  const recaptchaLoaded = useRef(false);
  const recaptchaWidgetId = useRef(null);
  const retryCount = useRef(0);
  const maxRetries = 3;

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
    nome_cliente: "",
    email: "",
    cpf: "",
    telefone: "",
    canal_id: 1,
  });

  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // 🧠 Função genérica para atualizar os campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔧 Função para esperar um tempo
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // 🔧 Carregar script do reCAPTCHA com Promise
  const loadRecaptchaScript = () => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.render) {
        resolve();
        return;
      }

      if (document.querySelector('script[src*="recaptcha"]')) {
        // Script já está carregando, esperar ele ficar pronto
        const checkInterval = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.render) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log("reCAPTCHA script carregado");
        resolve();
      };
      
      script.onerror = () => {
        console.error("Erro ao carregar reCAPTCHA");
        reject(new Error("Falha ao carregar reCAPTCHA"));
      };
      
      document.head.appendChild(script);
      recaptchaLoaded.current = true;
    });
  };

  // 🔧 Esperar pela API do reCAPTCHA
  const waitForRecaptchaAPI = async () => {
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos no total
    
    while (attempts < maxAttempts) {
      if (window.grecaptcha && window.grecaptcha.render) {
        console.log("reCAPTCHA API pronta após", attempts * 100, "ms");
        return true;
      }
      await delay(100);
      attempts++;
    }
    
    throw new Error("reCAPTCHA API não carregou dentro do tempo esperado");
  };

  // 🔧 Inicializar reCAPTCHA
  const initializeRecaptcha = async () => {
    try {
      setRecaptchaError("");
      
      // Verificar se já existe um widget
      if (recaptchaWidgetId.current !== null) {
        return;
      }

      // Verificar se o container existe
      const container = document.getElementById("recaptcha-container");
      if (!container) {
        throw new Error("Container do reCAPTCHA não encontrado");
      }

      // Limpar container
      container.innerHTML = '';

      // Carregar script se necessário
      await loadRecaptchaScript();
      
      // Esperar API ficar pronta
      await waitForRecaptchaAPI();

      // Renderizar reCAPTCHA
      console.log("Inicializando reCAPTCHA...");
      recaptchaWidgetId.current = window.grecaptcha.render(container, {
        sitekey: "6LdqZvorAAAAAFz1y_2N_xDFmjy4QoEZoH7HbjZG",
        callback: onRecaptchaSuccess,
        "error-callback": onRecaptchaError,
        "expired-callback": onRecaptchaExpired,
        theme: "light",
        size: "normal"
      });

      console.log("reCAPTCHA inicializado com sucesso");
      setRecaptchaReady(true);
      retryCount.current = 0;

    } catch (error) {
      console.error("Erro ao inicializar reCAPTCHA:", error);
      setRecaptchaError(`Falha ao carregar o reCAPTCHA: ${error.message}`);
      setRecaptchaReady(false);
      
      // Tentar novamente se não excedeu o limite
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        console.log(`Tentativa ${retryCount.current} de ${maxRetries}`);
        await delay(1000 * retryCount.current); // Backoff exponencial
        await initializeRecaptcha();
      }
    }
  };

  // 🔧 Callback de sucesso do reCAPTCHA
  const onRecaptchaSuccess = (token) => {
    console.log("reCAPTCHA validado:", token);
    setRecaptchaToken(token);
    setRecaptchaError("");
  };

  // 🔧 Callback de erro do reCAPTCHA
  const onRecaptchaError = () => {
    console.error("Erro no reCAPTCHA");
    setRecaptchaError("Erro na validação do reCAPTCHA. Tente novamente.");
    setRecaptchaToken("");
  };

  // 🔧 Callback de expiração do reCAPTCHA
  const onRecaptchaExpired = () => {
    console.log("reCAPTCHA expirado");
    setRecaptchaToken("");
    resetRecaptcha();
  };

  // 🔧 Resetar reCAPTCHA
  const resetRecaptcha = () => {
    if (window.grecaptcha && recaptchaWidgetId.current !== null) {
      try {
        window.grecaptcha.reset(recaptchaWidgetId.current);
        setRecaptchaToken("");
        setRecaptchaError("");
      } catch (error) {
        console.error("Erro ao resetar reCAPTCHA:", error);
      }
    }
  };

  // 🔧 Efeito principal para inicializar o reCAPTCHA
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await delay(500); // Esperar o DOM renderizar
      if (mounted) {
        await initializeRecaptcha();
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔧 Recarregar quando a página ficar visível novamente
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !recaptchaReady) {
        console.log("Página visível - recarregando reCAPTCHA");
        await initializeRecaptcha();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [recaptchaReady]);

  // 🚀 Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("É necessário aceitar as políticas de privacidade.");
      return;
    }

    if (!recaptchaToken) {
      setRecaptchaError("Por favor, complete o reCAPTCHA.");
      
      // Se o reCAPTCHA não está pronto, tentar reinicializar
      if (!recaptchaReady) {
        await initializeRecaptcha();
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.30.26:8090/ocurrence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptcha_token: recaptchaToken,
        }),
      });
      
      console.log("Resposta do servidor:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      navigate("/response", { state: { data } });
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Falha ao enviar o formulário. Tente novamente.");
      resetRecaptcha(); // Resetar reCAPTCHA em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // 🔧 Recarregar manualmente o reCAPTCHA
  const reloadRecaptcha = async () => {
    setRecaptchaReady(false);
    setRecaptchaToken("");
    setRecaptchaError("");
    recaptchaWidgetId.current = null;
    retryCount.current = 0;
    
    await initializeRecaptcha();
  };

  // 🔧 Forçar recriação do container
  const recreateRecaptchaContainer = async () => {
    const container = document.getElementById("recaptcha-container");
    if (container) {
      container.innerHTML = '';
      // Adicionar um pequeno delay para garantir que o DOM foi atualizado
      await delay(100);
    }
    await reloadRecaptcha();
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Nova Ocorrência</h2>

      <form onSubmit={handleSubmit} className="row g-3">

        {/* Seções do formulário mantidas iguais */}
        {/* =========================
            CARD - DADOS DO MANIFESTANTE
        ========================== */}
        <div className="card p-3 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-success">👤 Dados do Manifestante</h5>
            <p className="text-muted small mb-4">
              Informe quem está registrando a manifestação e os dados do cliente atendido.
            </p>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nome do Manifestante</label>
                <input
                  type="text"
                  className="form-control"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">Nome completo do manifestante.</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Nome do Cliente Atendido</label>
                <input
                  type="text"
                  className="form-control"
                  name="nome_cliente"
                  value={formData.nome_cliente}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">Beneficiário ou paciente envolvido.</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Cartão do Beneficiário</label>
                <input
                  type="text"
                  className="form-control"
                  name="cartao_beneficiario"
                  value={formData.cartao_beneficiario}
                  onChange={handleChange}
                />
                <small className="text-muted">Número do cartão Unimed (se houver).</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  className="form-control"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                />
                <small className="text-muted">Apenas números, sem pontos ou traços.</small>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            CARD - CONTATO
        ========================== */}
        <div className="card p-3 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-success">☎️ Informações de Contato</h5>
            <p className="text-muted small mb-4">
              Preencha como prefere ser contatado.
            </p>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Telefone</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
                <small className="text-muted">Ex: (12) 99999-9999</small>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            CARD - DETALHES
        ========================== */}
        <div className="card p-3 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-success">📝 Detalhes da Ocorrência</h5>
            <p className="text-muted small mb-4">
              Escolha as opções que descrevem melhor a manifestação.
            </p>

            <div className="row g-3">
              {/* Classificação */}
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
                  <option value="2">Normal</option>
                  <option value="3">Baixa Prioridade</option>
                </select>
              </div>

              {/* Unidade */}
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
                  <option value="2">Clínica Sul</option>
                  <option value="3">Hospital Unimed</option>
                </select>
              </div>

              {/* Identificação */}
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
                  <option value="2">Prestador</option>
                  <option value="3">Outros</option>
                </select>
              </div>

              {/* Forma de Resposta */}
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
                  <option value="2">Telefone</option>
                  <option value="3">Carta</option>
                </select>
              </div>

              {/* Assunto */}
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
                  <option value="2">Cobrança</option>
                  <option value="3">Autorização</option>
                </select>
              </div>

              {/* Subassunto */}
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
                  <option value="2">Erro de fatura</option>
                  <option value="3">Problema de sistema</option>
                </select>
              </div>

              {/* Canal */}
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
                  <option value="2">E-mail</option>
                  <option value="3">Presencial</option>
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
                <small className="text-muted">Informe o protocolo anterior (se houver).</small>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            CARD - DESCRIÇÃO
        ========================== */}
        <div className="card p-3 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-success">🗒️ Descrição da Ocorrência</h5>
            <p className="text-muted small mb-3">
              Descreva o ocorrido de forma clara e detalhada.
            </p>

            <textarea
              className="form-control"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* =========================
            POLÍTICA + RECAPTCHA + BOTÃO
        ========================== */}
        <div className="col-12 mt-3">
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
              >
                políticas de privacidade
              </a>
            </label>
          </div>
        </div>

        {/* reCAPTCHA melhorado */}
        <div className="col-12 text-center mt-4">
          <div className="mb-3">
            <div 
              id="recaptcha-container" 
              className="d-flex justify-content-center mb-2"
              style={{ minHeight: '78px' }}
            ></div>
            
            {!recaptchaReady && !recaptchaError && (
              <div className="text-muted small">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Carregando reCAPTCHA...
              </div>
            )}
          </div>
          
          {recaptchaError && (
            <div className="alert alert-warning d-inline-flex align-items-center" role="alert">
              <small>{recaptchaError}</small>
              <div className="ms-2">
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-warning me-1"
                  onClick={reloadRecaptcha}
                >
                  ↻ Tentar Novamente
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={recreateRecaptchaContainer}
                >
                  🔄 Recriar Container
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-success px-5 mt-3" 
            disabled={loading || !recaptchaReady}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}