import React, { useState, useEffect, useRef } from 'react';

export default function WhatsAppChat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('whatsappMessages');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [protocolo, setProtocolo] = useState(null);
  const messagesEndRef = useRef(null);

  // Scrolla para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Salva mensagens no localStorage


  // Saudação inicial com pedido do protocolo (executa só uma vez)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: 'Olá! Por favor, insira o número do protocolo para começarmos.',
          sender: 'other',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, []);

  // Envia mensagem
  const sendMessage = () => {
    if (!input.trim()) return;

    if (!protocolo) {
      // O que a pessoa digitou é o protocolo
      setProtocolo(input.trim());
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: `Número do protocolo registrado: ${input.trim()}`,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: Date.now() + 1,
          text: 'Protocolo recebido! Aguarde enquanto verifico.',
          sender: 'other',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setInput('');
    } else {
      // Envio normal da mensagem
      const newMsg = {
        id: Date.now(),
        text: input.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, newMsg]);
      setInput('');
    }
  };

  // Enter envia mensagem, Shift+Enter pula linha
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simular resposta automática só depois do protocolo
  useEffect(() => {
    if (messages.length === 0 || !protocolo) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === 'me') {
      const timeout = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: 'Recebido! 👍',
            sender: 'other',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [messages, protocolo]);

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>Chat do Processo</div>

      <div style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.noMessages}>Carregando...</div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.sender === 'me'
                ? styles.messageRight
                : styles.messageLeft),
            }}
          >
            <div style={styles.messageText}>{msg.text}</div>
            <div style={styles.timestamp}>{msg.timestamp}</div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          placeholder={
            protocolo
              ? 'Digite sua mensagem...'
              : 'Digite o número do protocolo aqui...'
          }
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={styles.textarea}
          disabled={false}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          {protocolo ? 'Enviar' : 'Enviar Protocolo'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    maxWidth: '900px',
    width: '90vw',
    height: '80vh',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#e5ddd5',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    padding: '15px',
    backgroundColor: '#075e54',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '22px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  messagesContainer: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    backgroundColor: '#ece5dd',
  },
  noMessages: {
    color: '#999',
    textAlign: 'center',
    marginTop: '30px',
    fontSize: '18px',
  },
  message: {
    maxWidth: '70%',
    marginBottom: '12px',
    padding: '12px 16px',
    borderRadius: '20px',
    position: 'relative',
    wordBreak: 'break-word',
    fontSize: '16px',
  },
  messageLeft: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageRight: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  messageText: {
    marginBottom: '6px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'right',
  },
  inputContainer: {
    display: 'flex',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  },
  textarea: {
    flex: 1,
    resize: 'none',
    borderRadius: '24px',
    border: '1px solid #ccc',
    padding: '12px 16px',
    fontSize: '16px',
    outline: 'none',
  },
  sendButton: {
    marginLeft: '15px',
    backgroundColor: '#075e54',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};
