// import { createContext, useCallback, useContext, useReducer } from "react";
// import { getProjects } from "../services/authService";


// const Context = createContext();
// const FetchContext = createContext();

// const initialState = {
//     projects : [],
//     sharedProjects : [],
//     loading : false,
//     success : false,
//     error : null
// }

// function projectReducer(state,action) {
//     switch(action.type){
//         case 'START_PROJECTS' :
//             return {...state ,loading:true};
//         case 'PROJECTS_SUCCESS' :
//             return {...state , projects : action.payload.projects,sharedProjects : action.payload.sharedProjects, loading : false, success:true};
//         case 'PROJECTS_FAILURE' :
//             return {...state ,loading : false, error:action.payload};
//         default : 
//             return state;
//     }    
// } 


// export default function ProjectsProvider({children}){
//     const [state,dispatch] = useReducer(projectReducer,initialState);

//     const fetchProjects = useCallback(async function fetchProjects(){
//         dispatch({type:'START_PROJECTS'})
//         try{
//             const respone1 = await getProjects(false);
//             const projects = respone1.data;
//             const respone2 = await getProjects(true);
//             const sharedProjects = respone2.data;
//             dispatch({
//                 type : 'PROJECTS_SUCCESS',
//                 payload : {projects,sharedProjects},
//             })
//         } catch (err) {
//             dispatch({ type: 'PROJECTS_FAILURE', payload: err.response.data.message })
//         }
//     },[])
//     return(
//         <Context.Provider
//                value={{ 
//                 ...state,
//                 dispatch
//                 }}
//         >
//             <FetchContext.Provider
//             value={fetchProjects}
//             >
//             {children}
//             </FetchContext.Provider>
//         </Context.Provider>
//     )
// }

// export const useProjects = () => {
//   const context = useContext(Context);
//   if (!context) {
//     throw new Error("useProjects must be used within ProjectsProvider");
//   }
//   return context;
// };
// export const useFetchProjects = () => {
//   const context = useContext(FetchContext);
//   if (!context) {
//     throw new Error("useProjects must be used within ProjectsProvider");
//   }
//   return context;
// };