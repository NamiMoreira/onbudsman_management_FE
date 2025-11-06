import React, { useState } from "react";

export default function New() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [ocorrenciaId, setOcorrenciaId] = useState(""); // ID para buscar a ocorrência
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState({
    cpf: "",
    cartao_beneficiario: "",
    status: "",
    nome: "",
    email: ""
  });

  const [formData, setFormData] = useState({
    reanalise: false,
    classificacao_id: "",
    unidade_id: "",
    descricao: "",
    cartao_beneficiario: "",
    manifestacao_ant: "",
    identificacao_id: "",
    forma_resposta_id: "",
    assunto_id: "",
    sub_assunto_id: "",
    nome: "",
    nome_cliente: "",
    email: "",
    cpf: "",
    telefone: "",
    canal_id: "",
  });

  const userInfo = {
    name: "Carlos Silva",
    group: "Ouvidoria",
    email: "carlos.silva@unimed.com.br"
  };

  const statusOptions = [
    { value: "", label: "Todos os status" },
    { value: "aberto", label: "Aberto" },
    { value: "pendente_documentos", label: "Pendente Documentos" },
    { value: "pendente_setor", label: "Pendente Setor" },
    { value: "pendente_demandante", label: "Pendente Demandante" },
    { value: "finalizado", label: "Finalizado" }
  ];

  // Opções para os selects
  const classificacaoOptions = [
    { value: "", label: "Selecione" },
    { value: "1", label: "Urgente" },
    { value: "2", label: "Normal" },
    { value: "3", label: "Baixa Prioridade" }
  ];

  const unidadeOptions = [
    { value: "", label: "Selecione" },
    { value: "1", label: "Unidade Central" },
    { value: "2", label: "Clínica Sul" },
    { value: "3", label: "Hospital Unimed" }
  ];

  const identificacaoOptions = [
    { value: "", label: "Selecione" },
    { value: "1", label: "Beneficiário" },
    { value: "2", label: "Prestador" },
    { value: "3", label: "Outros" }
  ];

  const formaRespostaOptions = [
    { value: "", label: "Selecione" },
    { value: "1", label: "E-mail" },
    { value: "2", label: "Telefone" },
    { value: "3", label: "Carta" }
  ];

  const assuntoOptions = [
    { value: "", label: "Selecione" },
    { value: "1", label: "Atendimento" },
    { value: "2", label: "Cobrança" },
    { value: "3", label: "Autorização" }
  ];

  const subAssuntoOptions = [
    { value: "", label: "Selecione" },
    { value: "1", label: "Demora no atendimento" },
    { value: "2", label: "Erro de fatura" },
    { value: "3", label: "Problema de sistema" }
  ];

  const canalOptions = [
    { value: "", label: "Selecione" },
    { value: "1", label: "Telefone" },
    { value: "2", label: "E-mail" },
    { value: "3", label: "Presencial" }
  ];

  const handleMenuClick = (menuName) => {
    alert(`${menuName} clicado!`);
  };

  const handleUserAction = (action) => {
    alert(`${action} clicado!`);
    setShowUserMenu(false);
  };

  // 🧠 Função genérica para atualizar os campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // 🧠 Função para atualizar os filtros de busca
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 🔍 Buscar ocorrência pelo ID
  const fetchOcorrencia = async (id) => {
    if (!id) {
      alert("Por favor, informe o ID da ocorrência");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://192.168.30.26:8090/ocurrence/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Ocorrência não encontrada`);
      }

      const data = await response.json();
      
      // Preencher o formulário com os dados da ocorrência
      setFormData({
        reanalise: data.reanalise || false,
        classificacao_id: data.classificacao_id || "",
        unidade_id: data.unidade_id || "",
        descricao: data.descricao || "",
        cartao_beneficiario: data.cartao_beneficiario || "",
        manifestacao_ant: data.manifestacao_ant || "",
        identificacao_id: data.identificacao_id || "",
        forma_resposta_id: data.forma_resposta_id || "",
        assunto_id: data.assunto_id || "",
        sub_assunto_id: data.sub_assunto_id || "",
        nome: data.nome || "",
        nome_cliente: data.nome_cliente || "",
        email: data.email || "",
        cpf: data.cpf || "",
        telefone: data.telefone || "",
        canal_id: data.canal_id || "",
      });

      alert("Ocorrência carregada com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar ocorrência:", error);
      alert(`Erro ao carregar ocorrência: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Buscar ocorrências por filtros
  const searchOcorrencias = async () => {
    setSearching(true);
    setShowResults(false);
    
    try {
      // Construir query string com os filtros
      const queryParams = new URLSearchParams();
      
      if (searchFilters.cpf) queryParams.append('cpf', searchFilters.cpf);
      if (searchFilters.cartao_beneficiario) queryParams.append('cartao_beneficiario', searchFilters.cartao_beneficiario);
      if (searchFilters.status) queryParams.append('status', searchFilters.status);
      if (searchFilters.nome) queryParams.append('nome', searchFilters.nome);
      if (searchFilters.email) queryParams.append('email', searchFilters.email);

      const queryString = queryParams.toString();
      const url = queryString 
        ? `http://192.168.30.26:8090/ocurrence?${queryString}`
        : `http://192.168.30.26:8090/ocurrence`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Não foi possível buscar as ocorrências`);
      }

      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : [data]);
      setShowResults(true);
      
      if (Array.isArray(data) && data.length === 0) {
        alert("Nenhuma ocorrência encontrada com os filtros informados.");
      }
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
      alert(`Erro ao buscar ocorrências: ${error.message}`);
    } finally {
      setSearching(false);
    }
  };

  // 🔄 Atualizar ocorrência
  const updateOcorrencia = async () => {
    if (!ocorrenciaId) {
      alert("Nenhuma ocorrência carregada para atualizar");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`http://192.168.30.26:8090/ocurrence/${ocorrenciaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      alert("Ocorrência atualizada com sucesso!");
      console.log("Ocorrência atualizada:", data);
    } catch (error) {
      console.error("Erro ao atualizar ocorrência:", error);
      alert(`Erro ao atualizar ocorrência: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // 🔍 Carregar ocorrência selecionada dos resultados
  const loadOcorrenciaFromResults = (ocorrencia) => {
    setOcorrenciaId(ocorrencia.id || ocorrencia._id);
    setFormData({
      reanalise: ocorrencia.reanalise || false,
      classificacao_id: ocorrencia.classificacao_id || "",
      unidade_id: ocorrencia.unidade_id || "",
      descricao: ocorrencia.descricao || "",
      cartao_beneficiario: ocorrencia.cartao_beneficiario || "",
      manifestacao_ant: ocorrencia.manifestacao_ant || "",
      identificacao_id: ocorrencia.identificacao_id || "",
      forma_resposta_id: ocorrencia.forma_resposta_id || "",
      assunto_id: ocorrencia.assunto_id || "",
      sub_assunto_id: ocorrencia.sub_assunto_id || "",
      nome: ocorrencia.nome || "",
      nome_cliente: ocorrencia.nome_cliente || "",
      email: ocorrencia.email || "",
      cpf: ocorrencia.cpf || "",
      telefone: ocorrencia.telefone || "",
      canal_id: ocorrencia.canal_id || "",
    });
    setShowResults(false);
    alert("Ocorrência carregada para edição!");
  };

  // 🧹 Limpar filtros
  const clearFilters = () => {
    setSearchFilters({
      cpf: "",
      cartao_beneficiario: "",
      status: "",
      nome: "",
      email: ""
    });
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="d-flex">
      {/* Sidebar Lateral */}
      <div className="bg-light border-end" style={{width: '250px', minHeight: '100vh'}}>
        <div className="p-3">
          <h5 className="text-success mb-4">Ouvidoria</h5>
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a 
                className="nav-link text-dark" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("Consultar Processos");
                }}
              >
                <i className="bi bi-search me-2"></i>
                Consultar Processos
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link text-dark" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("Relatórios");
                }}
              >
                <i className="bi bi-bar-chart me-2"></i>
                Relatórios
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link text-dark" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("Configurações");
                }}
              >
                <i className="bi bi-gear me-2"></i>
                Configurações
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link text-dark" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("Usuários");
                }}
              >
                <i className="bi bi-people me-2"></i>
                Usuários
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-grow-1">
        {/* Header Superior */}
        <div className="bg-white border-bottom p-3">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="mb-0">Gerenciamento de Ocorrências</h4>
            </div>
            <div className="col-auto position-relative">
              {/* Ícone do Usuário */}
              <div 
                className="d-flex align-items-center cursor-pointer p-2 rounded"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{cursor: 'pointer'}}
              >
                <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center me-2"
                     style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-person text-dark fs-5"></i>
                </div>
                <i className={`bi bi-chevron-down ms-1 ${showUserMenu ? 'rotate-180' : ''}`}></i>
              </div>

              {/* Menu Dropdown do Usuário */}
              {showUserMenu && (
                <div className="position-absolute end-0 mt-2 bg-white rounded shadow-lg border"
                     style={{width: '250px', zIndex: 1000}}>
                  {/* Informações do Usuário */}
                  <div className="p-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{width: '45px', height: '45px'}}>
                        <i className="bi bi-person text-dark fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">{userInfo.name}</h6>
                        <small className="text-muted">{userInfo.group}</small>
                        <br />
                        <small className="text-muted">{userInfo.email}</small>
                      </div>
                    </div>
                  </div>

                  {/* Opções do Menu */}
                  <div className="py-2">
                    <a 
                      href="#" 
                      className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUserAction("Trocar Senha");
                      }}
                    >
                      <i className="bi bi-key me-3"></i>
                      <div>
                        <div>Trocar Senha</div>
                        <small className="text-muted">Alterar senha de acesso</small>
                      </div>
                    </a>
                    <hr className="my-1" />
                    <a 
                      href="#" 
                      className="dropdown-item d-flex align-items-center px-3 py-2 text-dark text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUserAction("Sair");
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-3"></i>
                      <div>
                        <div>Sair</div>
                        <small className="text-muted">Encerrar sessão</small>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card de Ações */}
        <div className="container-fluid mt-3">
          <div className="card bg-success text-white mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col">
                  <h5 className="card-title mb-0">Ações da Ocorrência</h5>
                </div>
                <div className="col-auto">
                  <div className="btn-group" role="group">
                    <button 
                      type="button" 
                      className="btn btn-light btn-sm"
                      onClick={() => handleMenuClick("Enviar para outro setor")}
                    >
                      <i className="bi bi-send me-1"></i>
                      Enviar para outro setor
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-light btn-sm"
                      onClick={() => handleMenuClick("Alterar dados")}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Alterar dados
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-light btn-sm"
                      onClick={() => handleMenuClick("Responder comentários")}
                    >
                      <i className="bi bi-chat me-1"></i>
                      Responder comentários
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-light btn-sm"
                      onClick={() => handleMenuClick("Finalizar demanda")}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Finalizar demanda
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Ocorrência */}
          <div className="container my-4">
            <h2 className="mb-4 text-center">Dados da Ocorrência</h2>

            {/* Buscar Ocorrência - Com Filtros */}
            <div className="card p-3 shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="card-title text-success">🔍 Buscar Ocorrência</h5>
                
                {/* Busca por ID */}
                <div className="row g-3 align-items-end mb-4">
                  <div className="col-md-8">
                    <label className="form-label">ID da Ocorrência</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Digite o ID da ocorrência"
                      value={ocorrenciaId}
                      onChange={(e) => setOcorrenciaId(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="button" 
                      className="btn btn-success w-100"
                      onClick={() => fetchOcorrencia(ocorrenciaId)}
                      disabled={loading || !ocorrenciaId}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Carregando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Buscar por ID
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Filtros de Busca */}
                <div className="border-top pt-3">
                  <h6 className="text-muted mb-3">Buscar por Filtros</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">CPF</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cpf"
                        placeholder="Digite o CPF"
                        value={searchFilters.cpf}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Cartão do Beneficiário</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cartao_beneficiario"
                        placeholder="Digite o cartão"
                        value={searchFilters.cartao_beneficiario}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={searchFilters.status}
                        onChange={handleFilterChange}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        placeholder="Digite o nome"
                        value={searchFilters.nome}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Digite o e-mail"
                        value={searchFilters.email}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>

                  {/* Botões de Ação dos Filtros */}
                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-success w-100"
                        onClick={searchOcorrencias}
                        disabled={searching}
                      >
                        {searching ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Buscando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-funnel me-2"></i>
                            Buscar com Filtros
                          </>
                        )}
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary w-100"
                        onClick={clearFilters}
                      >
                        <i className="bi bi-eraser me-2"></i>
                        Limpar Filtros
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resultados da Busca */}
                {showResults && searchResults.length > 0 && (
                  <div className="mt-4">
                    <h6 className="text-success">Resultados da Busca ({searchResults.length})</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Cartão</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((ocorrencia, index) => (
                            <tr key={index}>
                              <td>{ocorrencia.id || ocorrencia._id}</td>
                              <td>{ocorrencia.nome}</td>
                              <td>{ocorrencia.cpf}</td>
                              <td>{ocorrencia.cartao_beneficiario}</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {ocorrencia.status || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => loadOcorrenciaFromResults(ocorrencia)}
                                >
                                  <i className="bi bi-pencil"></i> Editar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =========================
                CARD - DADOS DO MANIFESTANTE
            ========================== */}
            <div className="card p-3 shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="card-title text-success">👤 Dados do Manifestante</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nome do Manifestante </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Nome do Cliente Atendido </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome_cliente"
                      value={formData.nome_cliente}
                      onChange={handleChange}
                      required
                    />
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
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
                CARD - CONTATO
            ========================== */}
            <div className="card p-3 shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="card-title text-success">☎️ Informações de Contato</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">E-mail </label>
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
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
                CARD - DETALHES DA OCORRÊNCIA
            ========================== */}
            <div className="card p-3 shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="card-title text-success">📝 Detalhes da Ocorrência</h5>
                <div className="row g-3">
                  {/* Classificação */}
                  <div className="col-md-4">
                    <label className="form-label">Classificação </label>
                    <select
                      className="form-select"
                      name="classificacao_id"
                      value={formData.classificacao_id}
                      onChange={handleChange}
                      required
                    >
                      {classificacaoOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unidade */}
                  <div className="col-md-4">
                    <label className="form-label">Unidade </label>
                    <select
                      className="form-select"
                      name="unidade_id"
                      value={formData.unidade_id}
                      onChange={handleChange}
                      required
                    >
                      {unidadeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Identificação */}
                  <div className="col-md-4">
                    <label className="form-label">Identificação </label>
                    <select
                      className="form-select"
                      name="identificacao_id"
                      value={formData.identificacao_id}
                      onChange={handleChange}
                      required
                    >
                      {identificacaoOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Forma de Resposta */}
                  <div className="col-md-4">
                    <label className="form-label">Forma de Resposta </label>
                    <select
                      className="form-select"
                      name="forma_resposta_id"
                      value={formData.forma_resposta_id}
                      onChange={handleChange}
                      required
                    >
                      {formaRespostaOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assunto */}
                  <div className="col-md-4">
                    <label className="form-label">Assunto </label>
                    <select
                      className="form-select"
                      name="assunto_id"
                      value={formData.assunto_id}
                      onChange={handleChange}
                      required
                    >
                      {assuntoOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subassunto */}
                  <div className="col-md-4">
                    <label className="form-label">Subassunto </label>
                    <select
                      className="form-select"
                      name="sub_assunto_id"
                      value={formData.sub_assunto_id}
                      onChange={handleChange}
                      required
                    >
                      {subAssuntoOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Canal */}
                  <div className="col-md-4">
                    <label className="form-label">Canal </label>
                    <select
                      className="form-select"
                      name="canal_id"
                      value={formData.canal_id}
                      onChange={handleChange}
                      required
                    >
                      {canalOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reanálise */}
                  <div className="col-md-4">
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="reanalise"
                        checked={formData.reanalise}
                        onChange={handleChange}
                        id="reanaliseCheck"
                      />
                      <label className="form-check-label" htmlFor="reanaliseCheck">
                        Reanálise
                      </label>
                    </div>
                  </div>

                  {/* Manifestação anterior */}
                  <div className="col-md-4">
                    <label className="form-label">Manifestação Anterior</label>
                    <input
                      type="text"
                      className="form-control"
                      name="manifestacao_ant"
                      value={formData.manifestacao_ant}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
                CARD - DESCRIÇÃO
            ========================== */}
            <div className="card p-3 shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="card-title text-success">🗒️ Descrição da Ocorrência</h5>
                <textarea
                  className="form-control"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Descreva detalhadamente a ocorrência..."
                ></textarea>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="text-center mt-4">
              <button 
                type="button" 
                className="btn btn-success px-5 me-3"
                onClick={updateOcorrencia}
                disabled={updating || !ocorrenciaId}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Atualizando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Atualizar Ocorrência
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline-secondary px-5"
                onClick={() => {
                  setOcorrenciaId("");
                  setFormData({
                    reanalise: false,
                    classificacao_id: "",
                    unidade_id: "",
                    descricao: "",
                    cartao_beneficiario: "",
                    manifestacao_ant: "",
                    identificacao_id: "",
                    forma_resposta_id: "",
                    assunto_id: "",
                    sub_assunto_id: "",
                    nome: "",
                    nome_cliente: "",
                    email: "",
                    cpf: "",
                    telefone: "",
                    canal_id: "",
                  });
                  setSearchFilters({
                    cpf: "",
                    cartao_beneficiario: "",
                    status: "",
                    nome: "",
                    email: ""
                  });
                  setSearchResults([]);
                  setShowResults(false);
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .rotate-180 {
          transform: rotate(180deg);
          transition: transform 0.2s ease;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}