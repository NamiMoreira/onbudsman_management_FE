// src/pages/Home.jsx
import React from 'react';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate(); // Hook do React Router

  return (
    <div className="container my-4">
      <h2>Ouvidoria</h2>
      <div className="row g-3">
        {/* Primeiro Card: Abrir nova manifestação */}
        <div className="col-12 col-md-4">
          <Card
            title="Manifestações"
            buttonText="Abrir nova Manifestação"
            onButtonClick={() => navigate('/New')}
          />
        </div>

        {/* Segundo Card: Consultar ocorrências */}
        <div className="col-12 col-md-4">
          <Card
            title="Manifestações"
            buttonText="Consultar Ocorrências"
            onButtonClick={() => window.location.href = 'http://localhost:3000/Ocurrence'}
          />
        </div>
      </div>
    </div>
  );
}