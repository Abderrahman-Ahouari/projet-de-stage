import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";

import Login from "./pages/login";
import Register from "./pages/Register";
import Kanban from "./pages/Kanban";
import Projects from "./pages/Projects";
import Progress from "./pages/Progress";
import ManageTeam from "./pages/ManageTeam";
import OAuthSuccess from "./pages/OauthSuccess";
import AuthProvider from "./contexts/AuthContext";



export default function App() {

  return (
    <Router>
      <AuthProvider>
        <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/projects/:id/kanban" element={<Kanban/>}/>
        <Route path="/projects/:id/progress" element={<Progress/>} />
        <Route path="/projects/:id/team" element={<ManageTeam/>} />
        <Route path="/projects/:id/settings" element={<ManageTeam/>} />
        <Route path="/oauth-success/:token" element={<OAuthSuccess/>} />
      </Routes>
    </AuthProvider>
    </Router>
  );
}


