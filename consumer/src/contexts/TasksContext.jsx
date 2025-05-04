// import { createContext, useCallback, useContext, useReducer } from "react";
// import { getTasks } from "../services/authService";

// const Context = createContext();
// const FetchContext = createContext();

// const initialState = {
//   fetchedTasks: [],
//   loading: false,
//   success: false,
//   error: null,
// };

// function tasksReducer(state, action) {
//   switch (action.type) {
//     case "START_TASKS":
//       return { ...state, loading: true };
//     case "TASKS_SUCCESS":
//       return {
//         ...state,
//         fetchedTasks: action.payload,
//         loading: false,
//         success: true,
//       };
//     case "TASKS_FAILURE":
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// }

// export default function TasksProvider({ children }) {
//   const [state, dispatch] = useReducer(tasksReducer, initialState);
//   const fetchTasks = useCallback(async function fetchTasks(
//     projectId,
//     load = true
//   ) {
//     load && dispatch({ type: "START_TASKS" });
//     try {
//       const respone = await getTasks(projectId);
//       const tasks = respone.data;

//       dispatch({
//         type: "TASKS_SUCCESS",
//         payload: tasks,
//       });
//     } catch (err) {
//       dispatch({ type: "TASKS_FAILURE", payload: err.response.data.message });
//     }
//   },
//   []);



//   return (
//     <Context.Provider
//       value={{
//         ...state,
//         dispatch,
//       }}
//     >
//       <FetchContext.Provider value={fetchTasks}>
//             {children}
//       </FetchContext.Provider>
//     </Context.Provider>
//   );
// }

// export const useTasks = () => {
//   const context = useContext(Context);
//   if (!context) {
//     throw new Error("useTasks must be used within FetchProvider");
//   }
//   return context;
// };
// export const useFetchTasks = () => {
//   const context = useContext(FetchContext);
//   if (!context) {
//     throw new Error("useFetchTasks must be used within FetchProvider");
//   }
//   return context;
// };
