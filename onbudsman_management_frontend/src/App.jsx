import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import New from "./pages/New";
import Response from "./pages/Response";
import Ocurrence from "./pages/Ocurrence"
import UploadFiles from "./pages/UploadFiles";
import './index.css';
import Manage from "./pages/Manage"
import Consult from "./pages/Consult"

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/response" element={<Response />} />
        <Route path="/ocurrence" element={<Ocurrence />} />
        <Route path="/upload" element={<UploadFiles />} />
        <Route path="/manage" element={<Manage/>} />
        <Route path="/consult" element={<Consult/>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;