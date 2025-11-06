// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card'; // seu componente de card customizado

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container my-4">


      {/* Texto explicativo */}
      <section className="mb-5">
        <h1> Ouvidoria</h1>
        <h5>
          A Ouvidoria é um canal independente que garante a comunicação direta entre os usuários e a instituição.
          Aqui você pode registrar sugestões, elogios, reclamações ou denúncias.  
          Sua importância está em possibilitar melhorias contínuas nos serviços e assegurar transparência, agilidade e qualidade no atendimento.
        </h5>
      </section>

      {/* Cards de ação */}
      <div className="row">
        {/* Abrir nova ocorrência */}
        <div className="col-md-6 mb-4" id="abrir">
          <Card
            title="Abrir Nova Ocorrência"
            text="Registre uma nova ocorrência rapidamente."
            imageUrl="https://img.icons8.com/color/96/000000/add-file.png"
            bgColor="#007F3E" // verde Unimed
            textColor="#ffffff"
            onClick={() => navigate('/new')}
          />
        </div>

        {/* Consultar ocorrência */}
        <div className="col-md-6 mb-4" id="consultar">
          <Card
            title="Consultar Ocorrência"
            text="Acompanhe o status das suas ocorrências."
            imageUrl="https://img.icons8.com/color/96/000000/search--v1.png"
            bgColor="#007F3E" // tom complementar de verde
            textColor="#ffffff"
            onClick={() => navigate('/ocurrence')}
          />
        </div>
      </div>
    </div>
  );
}
