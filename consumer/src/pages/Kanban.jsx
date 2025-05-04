"use client";

import { use, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import TaskColumn from "../components/TaskColumn";
import { ClipLoader } from "react-spinners";
import {
  deleteProject,
  getCategories,
  getContributors,
  getProject,
  getTasks,
  updateStatus,
} from "../services/services";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const initialTasks = {
  todo: [],
  doing: [],
  review: [],
  done: [],
};

function structureTasks(tasks) {
  return {
    todo: tasks.filter((task) => task.status === "todo"),
    doing: tasks.filter((task) => task.status === "doing"),
    review: tasks.filter((task) => task.status === "review"),
    done: tasks.filter((task) => task.status === "done"),
  };
}

export default function KanbanBoard() {
  const {permissionsNames} = useOutletContext();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const { id} = useParams();
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["tasks",id],
    queryFn: async () => {
      const res1 = await getContributors(id);
      const res3 = await getProject(id)
      const respone = await getTasks(id);
      return { tasks: respone.data,project : res3.data, contributors: res1.data };
    },
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * .5, 
    cacheTime: 1000 * 60 * 60,
  });
  const fetchedTasks = data?.tasks;
  const contributors = data?.contributors;
  const project = data?.project;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [column, setColumn] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedTasks) setTasks(structureTasks(fetchedTasks));
  }, [fetchedTasks]);

  

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const res = await getCategories(id);
      return res.data;
    },
    staleTime: 1000 * 60 * .5, 
    cacheTime: 1000 * 60 * 60,
  });

  const moveTask = async (taskId, sourceStatus, targetStatus) => {
    if (sourceStatus === targetStatus) return;

    setTasks((prevTasks) => {
      const taskToMove = prevTasks[sourceStatus].find(
        (task) => task.id === taskId
      );
      if (!taskToMove) return prevTasks;

      const updatedTask = { ...taskToMove, status: targetStatus };

      return {
        ...prevTasks,
        [sourceStatus]: prevTasks[sourceStatus].filter(
          (task) => task.id !== taskId
        ),
        [targetStatus]: [...prevTasks[targetStatus], updatedTask],
      };
    });
    await updateStatus(id, taskId, targetStatus);
    queryClient.invalidateQueries(["tasks", id]);
  };
  async function handleDeleteProject(id) {
    queryClient.setQueryData(["projects"], (old) => {
      return {
        ...old,
        projects: old.projects.filter((project) => project.id !== id),
        sharedProjects : old.sharedProjects.filter((project) => project.id !== id)
      };
    });
    navigate("/projects");
    await deleteProject(id);
    return;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#f9fafb]">
        <main className="mx-auto max-w-7xl p-6">
          <Link className=" py-2 block text-blue-400 w-fit" to="/projects">&larr;Return to projects</Link>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#111827]">
              Project Kanban Board 
            </h1>
            {permissionsNames.includes("delete project") &&
              <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-1 rounded-md bg-[#ef4444] px-3 py-2 text-sm font-medium text-white hover:bg-[#ef4444]/90 cursor-pointer"
            >
              <span>Delete Project</span>
            </button>}
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center h-32">
              <ClipLoader color="#4f46e5" loading={loading} size={50} />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
              role="alert"
            >
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Kanban Board */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:grid-cols-4">
              <TaskColumn
                categories={categories}
                contributors={contributors}
                queryClient={queryClient}
                title="To Do"
                tasks={tasks.todo}
                status="todo"
                moveTask={moveTask}
                column={column}
                setColumn={setColumn}
              />
              <TaskColumn
                categories={categories}
                contributors={contributors}
                queryClient={queryClient}
                title="Doing"
                tasks={tasks.doing}
                status="doing"
                moveTask={moveTask}
                column={column}
                setColumn={setColumn}
              />
              <TaskColumn
                categories={categories}
                contributors={contributors}
                queryClient={queryClient}
                title="Review"
                tasks={tasks.review}
                status="review"
                moveTask={moveTask}
                column={column}
                setColumn={setColumn}
              />
              <TaskColumn
                categories={categories}
                contributors={contributors}
                queryClient={queryClient}
                title="Done"
                tasks={tasks.done}
                status="done"
                moveTask={moveTask}
                column={column}
                setColumn={setColumn}
              />
            </div>
          )}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-4">
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteProject(id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </DndProvider>
  );
}
