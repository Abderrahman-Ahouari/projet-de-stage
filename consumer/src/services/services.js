// src/services/authService.js
import api from "../lib/axios";

export const login = (credentials) => api.post("/login", credentials);
export const register = (credentials) => api.post("/register", credentials);
export const logout = () => api.post("/logout");
export const getUser = () => api.get("/user");



export const getProjects = (shared) => api.get(!shared ? "/user/projects" : "/user/shared");
export const getProject = (projectId) => api.get(`/projects/${projectId}`);
export const deleteProject = (projectId) => api.delete(`/projects/${projectId}`);
export const createProject = (project) => api.post(`/projects`,project);


export const getTasks = (projectId) => api.get(`/projects/${projectId}/tasks`);
export const updateStatus = (projectId,taskId,status) => api.put(`/projects/${projectId}/tasks/${taskId}`,{status});
export const createTask = (projectId,task) => api.post(`/projects/${projectId}/tasks`,task);
export const deleteTask = (projectId,taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`);
export const categorize = (projectId,taskId,categoryId) => api.put(`/projects/${projectId}/tasks/${taskId}`,{category_id : categoryId});


export const assign = (projectId,taskId,userId) => api.post(`/projects/${projectId}/tasks/${taskId}/assign`,{user_id : userId});
export const unassign = (projectId,taskId,userId) => api.delete(`/projects/${projectId}/tasks/${taskId}/unassign`,{data : {user_id : userId}});




export const getContributors = (projectId)=>api.get(`/projects/${projectId}/contributions`);
export const addContributor = (projectId,userId,roleId)=>api.post(`/projects/${projectId}/contributions`,{user_id: userId,role_id:roleId});
export const deleteContributor = (projectId,userId)=>api.delete(`/projects/${projectId}/contributions`,{data : { user_id : userId }});
export const changeRole = (projectId,userId,roleId) => api.put(`/projects/${projectId}/contributions`,{user_id :userId,role_id:roleId});



export const getCategories = (projectId) => api.get(`/projects/${projectId}/categories`);
export const addCategory = (projectId,category) => api.post(`/projects/${projectId}/categories`,category);
export const deleteCategory = (projectId,categoryId) => api.delete(`/projects/${projectId}/categories/${categoryId}`);





export const getRoles = (projectId) => api.get(`/projects/${projectId}/roles`);
export const addRole = (projectId,role) => api.post(`/projects/${projectId}/roles`,{role});
export const deleteRole = (projectId,roleId) => api.get(`/projects/${projectId}/roles/${roleId}`);



export const getNotifications = () => api.get(`/notifications`);
export const acceptInvite = (id) => api.post(`/notifications/${id}/accept`);
export const rejectInvite = (id) => api.post(`/notifications/${id}/reject`);
export const markAsRead = () => api.post(`/notifications/markAsRead`);
export const invite = (projectId,email,roleId) => api.post(`/projects/${projectId}/invite`,{role_id:roleId,email});


export const getPermissions = (projectId) => api.get(`/projects/${projectId}/permissions`);