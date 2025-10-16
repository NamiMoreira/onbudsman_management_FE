import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import New from "./pages/New";
import Response from "./pages/Response";
import Ocurrence from "./pages/Ocurrence"

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/response" element={<Response />} />
        <Route path="/ocurrence" element={<Ocurrence />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;