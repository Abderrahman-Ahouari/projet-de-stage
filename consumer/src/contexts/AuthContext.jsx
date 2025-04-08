import { createContext, useContext, useEffect, useReducer } from "react";





const initialState = {
    isLoggedIn: false,
    user: null,
    token: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload.user,
                token: action.payload.token,
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                token: null,
            };
        default:
            return state;
    }
};


const AuthContext  = createContext();




export default function AuthProvider({children}) {
    const [{isLoggedIn,user,token}, dispatch] = useReducer(reducer, initialState);
    
    
    useEffect(() => {

        const token = localStorage.getItem('token');
        if(!!token)
        (async () => {
            try {
              const res = await fetch("http://127.0.0.1:8000/api/user", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
      
              if (!res.ok) throw new Error("Failed to fetch user");
      
              const userData = await res.json();
              dispatch({
                type: "LOGIN",
                payload: { user: userData, token },
              });
            } catch (err) {
              console.error("AuthProvider fetch user error:", err);
              localStorage.removeItem("token");
              dispatch({ type: "LOGOUT" });
            }
          })();
          
},[]);
  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn,
        user,
        token,
        dispatch,
       }}
    >
        {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
    const context = useContext(AuthContext);
   if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
   }
    return context;
}
