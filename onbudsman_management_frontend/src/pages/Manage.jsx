import React, { useState } from "react";

export default function New() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userInfo = {
    name: "Carlos Silva",
    group: "Ouvidoria",
    email: "carlos.silva@unimed.com.br"
  };

  const handleMenuClick = (menuName) => {
    alert(`${menuName} clicado!`);
  };

  const handleUserAction = (action) => {
    alert(`${action} clicado!`);
    setShowUserMenu(false);
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

          {/* Área para conteúdo adicional */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Bem-vindo ao Sistema de Ouvidoria</h5>
              <p className="card-text">
                Utilize o menu lateral para navegar entre as funcionalidades do sistema.
              </p>
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