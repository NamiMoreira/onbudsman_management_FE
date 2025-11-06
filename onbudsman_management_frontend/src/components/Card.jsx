// src/components/Card.jsx
import React from 'react';

export default function Card({ title, text, imageUrl, bgColor, textColor, onClick }) {
  return (
    <div 
      className="card h-100 text-center p-3" 
      style={{ backgroundColor: bgColor, color: textColor, cursor: 'pointer' }}
      onClick={onClick}
    >
      <img src={imageUrl} alt={title} className="card-img-top mx-auto mb-3" style={{ width: '96px' }} />
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{text}</p>
    </div>
  );
}
