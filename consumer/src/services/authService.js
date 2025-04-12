// src/services/authService.js
import api from "../lib/axios";

export const login = (credentials) => api.post("/login", credentials);
export const register = (credentials) => api.post("/register", credentials);
export const logout = () => api.post("/logout");
export const getUser = () => api.get("/user");
export const getProjects = () => api.get("/user/projects");
