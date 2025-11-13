// src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header className="bg-success text-white">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
        
        {/* Logo ORM à esquerda */}
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="bg-white rounded d-flex align-items-center justify-content-center"
            style={{ width: 48, height: 48 }}
          >
            <img
              src="/logo_orm.png"
              alt="Meu Logo"
              style={{ height: 50, width: 250 }}
            />
          </div>
          <div>
            <h1 className="h2 mb-0">OBD</h1>
            <p className="mb-0 small">Manifestações Ouvidoria</p>
          </div>
        </div>

        {/* Navbar central */}
        <nav className="my-3 my-md-0">
          <ul className="nav justify-content-center">
            <li className="nav-item">
              <a href="/" className="nav-link text-white fw-bold">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/" className="nav-link text-white fw-bold">
                Sobre
              </a>
            </li>
            <li className="nav-item">
              <a href="/new" className="nav-link text-white fw-bold">
                Abertura Ocorrências
              </a>
            </li>
            <li className="nav-item">
              <a href="/ocurrence" className="nav-link text-white fw-bold">
                Consultar Ocorrências
              </a>
            </li>
          </ul>
        </nav>

        {/* Logo Unimed à direita */}
        <div>
          <img
            src="/logo.png"
            alt="Unimed"
            style={{ height: 100, objectFit: "contain" }}
          />
        </div>
      </div>
    </header>
  );
}
