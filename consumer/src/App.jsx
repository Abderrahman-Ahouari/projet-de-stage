import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";

import Login from "./pages/login";
import Register from "./pages/Register";
import Kanban from "./pages/Kanban";


export default function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kanban" element={<Kanban/>} />
      </Routes>
    </Router>
  );
}


