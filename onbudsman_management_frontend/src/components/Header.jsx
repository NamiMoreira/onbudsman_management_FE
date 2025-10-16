// src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header className="bg-success text-white">
      <div className="container d-flex justify-content-between align-items-center py-3">
        
        {/* Logo à esquerda */}
        <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
          <div className="bg-white rounded d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
            <img src="/logo_orm.png" alt="Meu Logo" style={{ height: 100, width: 300 }} />
          </div>
          <div>
            <h1 className="h2 mb-0">ORM</h1>
            <p className="mb-0 small">Manifestações Ouvidoria</p>
          </div>
        </div>

        {/* Logo Unimed à direita */}
        <div>
          <img src="/logo.jpg" alt="Unimed" style={{ height: 100, objectFit: "contain" }} />
        </div>

      </div>
    </header>
  );
}