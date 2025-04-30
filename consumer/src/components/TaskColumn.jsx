import { useState } from "react";
import { useDrop } from "react-dnd";
import { useOutletContext, useParams } from "react-router-dom";
import { createTask } from "../services/services";
import TaskCard from "./TaskCard";

const TaskColumn = ({title, tasks, status, moveTask,column,setColumn,contributors, queryClient,categories }) => {
   const {permissionsNames} = useOutletContext();
    const {id} = useParams()
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "TASK",
      drop: (item) => {
        if (permissionsNames.includes("update task status")) {
          moveTask(item.id, item.status, status); 
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [error, setError] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!newTitle.trim()) {
        setError("Title is required.");
        return;
      }
      const tempId = `temp-${Date.now()}`
      const newTask = {
        id: tempId,
        title: newTitle.trim(),
        description: newDescription.trim(),
        status,
        assignees: [],
        category : {}
      }

      queryClient.setQueryData(["tasks", id], (old) => ({
        ...old,
        tasks: [...old.tasks, newTask],
      }))
    
      // 4) Reset your form UI
      setNewTitle("")
      setNewDescription("")
      setError("")
      setColumn("")
    
      // 5) Fire off the real request
      try {
        await createTask(id, {
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
        })
      } catch {
        // 6) On error, pull it back out
        queryClient.setQueryData(["tasks", id], (old) => ({
          ...old,
          tasks: old.tasks.filter((t) => t.id !== tempId),
        }))
      } finally {
        // 7) And re‑sync with the server one last time
        queryClient.invalidateQueries(["tasks", id])
      }
    };
  
  
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#374151]">{title}</h2>
          <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#6b7280]">
            {tasks.length}
          </span>
        </div>
  
        <div
          ref={drop}
          className={`space-y-4 min-h-[200px] ${
            isOver ? "bg-[#f3f4f6] rounded-md" : ""
          }`}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} moveTask={moveTask} queryClient={queryClient} contributors={contributors} categories={categories} />
          ))}
  
          {column === status ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 p-3 border border-[#e5e7eb] rounded-md bg-white"
            >
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border p-2 rounded text-sm"
              />
              <textarea
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border p-2 rounded text-sm"
                rows={3}
              />
              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setColumn('');
                    setNewTitle("");
                    setNewDescription("");
                    setError("");
                  }}
                  className="text-sm px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-sm px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => {
                setColumn(status)
              }}
              className="flex w-full items-center justify-center rounded-md border border-dashed border-[#e5e7eb] py-3 text-sm text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Task
            </button>
          )}
        </div>
      </div>
    );
  };

  export default TaskColumn;