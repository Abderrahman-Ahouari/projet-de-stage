

import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { getUser,login as axiosLogin,logout as axiosLogout } from "../services/authService"; 
import { useNavigate } from "react-router-dom";


const initialState = {
  isLoggedIn: !!JSON.parse(localStorage.getItem("token")),
  user: JSON.parse(localStorage.getItem("user")),
  token: JSON.parse(localStorage.getItem("token")) || null,
  loading: false,
  success: false,
  error : null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false,success : true,isLoggedIn:true };
    case 'LOGIN_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...initialState };
    case 'LOADING':
      return { ...state,loading : !state.loading };
    default:
      return state;
  }
}

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    authReducer,
    initialState
  );
  const navigate = useNavigate();

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axiosLogin(credentials);  
      const { user, token } = response.data;
      localStorage.setItem('token',JSON.stringify(token));
      localStorage.setItem('user',JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data.message });
    }
  }, []);
  const oLogin = useCallback(async(token)=>{
    dispatch({ type: 'LOGIN_START' });
    try {
      localStorage.setItem('token',JSON.stringify(token));
      const response = await getUser("token");
      const user = response.data;
      localStorage.setItem('user',JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    }catch(error){
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
  },[])

  const logout = useCallback(async () => {
    dispatch({type : 'LOADING'});
    try {
      const response = await axiosLogout();
        localStorage.removeItem("token"); 
        dispatch({ type: "LOADING" }); 
        dispatch({ type: "LOGOUT" }); 
        
        navigate("/login"); // Redirect to login page
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: "LOGOUT" });
      navigate('/login'); 
    }
  }, []);


  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        login,
        oLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
