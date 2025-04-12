import { createContext, useContext, useReducer } from "react";
import { getProjects } from "../services/authService";


const Context = createContext();

const initialState = {
    projects : [],
    loading : false,
    success : false,
    error : null
}

function projectReducer(state,action) {
    switch(action.type){
        case 'START_PROJECTS' :
            return {...state ,loading:true};
        case 'PROJECTS_SUCCESS' :
            return {...state , projects : action.payload, loading : false, success:true};
        case 'PROJECTS_FAILURE' :
            return {...state ,loading : false, error:action.payload};
        default : 
            return state;
    }    
} 


export default function ProjectsProvider({children}){
    const [state,dispatch] = useReducer(projectReducer,initialState);

    async function fetchProjects(){
        dispatch({type:'START_PROJECTS'})
        try{
            const respone = await getProjects();
            const projects = respone.data;
            
            dispatch({
                type : 'PROJECTS_SUCCESS',
                payload : projects,
            })
        } catch (err) {
            dispatch({ type: 'LOGIN_FAILURE', payload: err.response.data.message })
        }
    }
    return(
        <Context.Provider
               value={{ 
                ...state,
                fetchProjects,
                dispatch
                }}
        >
            {children}
        </Context.Provider>
    )
}

export const useProjects = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
};