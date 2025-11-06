import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://192.168.30.26:8090", {
  transports: ["websocket"],
});

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      from: "bot",
      text: "Olá!\n Digite seu nome para começarmos.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const mounted = useRef(true);
  const typingTimeout = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(scrollToBottom, [messages, isBotTyping]);

  useEffect(() => {
    mounted.current = true;

    const handleBotResponse = (msg) => {
      if (!mounted.current) return;

      clearTimeout(typingTimeout.current);
      setIsBotTyping(true);

      const delay = Math.min(800, 200 + msg.text.length * 15);

      typingTimeout.current = setTimeout(() => {
        if (!mounted.current) return;

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), from: "bot", text: msg.text },
        ]);
        setIsBotTyping(false);
      }, delay);
    };

    socket.on("botResponse", handleBotResponse);

    return () => {
      mounted.current = false;
      clearTimeout(typingTimeout.current);
      socket.off("botResponse", handleBotResponse);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from: "user", text: userMsg },
    ]);
    setInput("");
    setIsBotTyping(true);

    socket.emit("userOption", userMsg);
  };

  return (
    <div
      className=""
      style={{
        
        paddingTop: "30px", // adiciona um respiro no topo
      }}
    >
      <div
        className="container d-flex justify-content-center"
        
      >
        <div
          className="card shadow-lg w-100"
          style={{
            maxWidth: "800px",
            height: "70vh",
            borderRadius: "12px",
          }}
        >
          <div
            className="card-header text-white text-center fw-bold"
            style={{ backgroundColor: "#00995D" }}
          >
            Atendimento Virtual Unimed
          </div>

          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex mb-3 ${
                  msg.from === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`p-3 rounded-3 ${
                    msg.from === "user"
                      ? "bg-success text-white"
                      : "bg-white border text-dark"
                  }`}
                  style={{ maxWidth: "70%", whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                ></div>
              </div>
            ))}

            {isBotTyping && (
              <div className="d-flex mb-3 justify-content-start">
                <div className="p-3 rounded-3 bg-white border text-dark">
                  <span>Digitando...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="card-footer bg-white border-top p-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="btn text-white"
                style={{ backgroundColor: "#00995D" }}
                onClick={handleSend}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
