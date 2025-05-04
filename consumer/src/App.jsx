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
import SomethingWentWrong from "./components/SomethingWentWrong";
import NotFound from "./components/NotFound";
import Project from "./pages/Project";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";



export default function App() {

  return (
    <Router>
      <AuthProvider>
        <Header />
        <div className="pt-14">
        <Routes>

  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route path="/projects" element={<Projects />} />
  <Route path="/projects/:id" element={<Project />}>
    <Route path="kanban" element={<ProtectedRoute permission="consult project"><Kanban/></ProtectedRoute>} />

    <Route path="progress" element={<ProtectedRoute permission="consult progress"><Progress /></ProtectedRoute>} />
    <Route path="team" element={<ProtectedRoute permission="consult team"><ManageTeam /></ProtectedRoute>} />
    <Route path="settings" element={<ProtectedRoute permission="manage roles"><Settings /></ProtectedRoute>} />
  </Route>

  <Route path="/oauth-success/:token" element={<OAuthSuccess />} />
  <Route path="/something-went-wrong" element={<SomethingWentWrong />} />
  <Route path="/404" element={<NotFound />} />
  <Route path="*" element={<NotFound />} />
</Routes>
</div>
    </AuthProvider>
    </Router>
  );
}


