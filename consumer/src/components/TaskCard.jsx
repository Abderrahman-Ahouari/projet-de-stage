import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { useOutletContext, useParams } from "react-router-dom";
import {
  deleteTask,
  assign,
  unassign,
  getCategories,
  addCategory,
  categorize,
  deleteCategory,
} from "../services/services";

import DeleteModal from "./DeleteModal";
import AssignModal from "./AssignModal";
import CategorizeModal from "./CategorizeModal";

const TaskCard = ({ queryClient, task, contributors, categories }) => {
  const {permissionsNames} = useOutletContext()
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id, status: task.status },
    collect: (m) => ({ isDragging: !!m.isDragging() }),
  }));

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOption = (opt) => {
    setMenuOpen(false);
    setModal(opt.toLowerCase());
  };

  const closeModal = () => setModal(null);

  const confirmDelete = async () => {
    setModal(null);
    queryClient.setQueryData(["tasks", id], (old) => ({
      ...old,
      tasks: old.tasks.filter((t) => t.id !== task.id),
    }));
    const res = await deleteTask(id, task.id);
    queryClient.invalidateQueries(["tasks", id]);
  };

  const handleAssign = async (contributor) => {
    setIsLoading(true);
    setModal(null);
    queryClient.setQueryData(["tasks", id], (old) => ({
      ...old,
      tasks: old.tasks.map((t) => {
        if (t.id !== task.id) return t;

        const already = t.assignees.some((u) => u.id === contributor.id);
        const newAssignees = already
          ? t.assignees.filter((u) => u.id !== contributor.id)
          : [...t.assignees, contributor];

        return { ...t, assignees: newAssignees };
      }),
    }));
    try {
      if (!contributor.isAssigned) await assign(id, task.id, contributor.id);
      if (contributor.isAssigned) await unassign(id, task.id, contributor.id);
      queryClient.invalidateQueries(["tasks", id]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const selectCategory = (cat) => {
    setModal(null);
    queryClient.setQueryData(["tasks", id], (old) => ({
      ...old,
      tasks: old.tasks.map((t) => {
        if (t.id !== task.id) return t;
        return {
          ...t,
          category: { ...t.category, name: cat.name, id: cat.id },
        };
      }),
    }));
    categorize(id, task.id, cat.id);
    queryClient.invalidateQueries(["tasks", id]);
  };

  useEffect(() => {
    if (!task.category) task.category = "basic";
  }, [task]);

  async function handleAddCategory(id, cat) {
    queryClient.setQueryData(["categories", id], (old) => {
      {
        return [...old, cat];
      }
    });
    await addCategory(id, cat);
    queryClient.invalidateQueries(["categories", id]);
  }
  async function handleDeleteCategory(id, catId) {
    queryClient.setQueryData(["categories", id], (old) => {
      {
        return old.filter(c=>c.id !== catId);
      }
    });
    const res = await deleteCategory(id, catId);
    console.log(res.data);
    
    queryClient.invalidateQueries(["categories", id]);
  }
  return (
    <>
      <div
        ref={drag}
        className={`relative rounded-md border border-[#e5e7eb] bg-white p-4 shadow-sm ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#111827]">{task.title}</h3>
          <p className="text-xs text-white inline-block font-light px-1 py-0.5 bg-indigo-400 rounded-sm">
            {task.category?.name}
          </p>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-[#9ca3af] cursor-pointer hover:text-black"
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
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                {["Assign", "Categorize", "Delete"]
                  .filter((o) => {
                    if (o === "Assign")
                      return permissionsNames.includes("assign task");
                    if (o === "Categorize")
                      return permissionsNames.includes("categorize task");
                    if (o === "Delete")
                      return permissionsNames.includes("delete task");
                    return false;
                  })
                  .map((o) => (
                    <button
                      key={o}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#111827] cursor-pointer"
                      onClick={() => handleOption(o)}
                    >
                      {o}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 4).map((user, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white bg-[#e5e7eb] overflow-hidden"
            >
              <img
                src={user.avatar}
                alt="Team member"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {task.assignees.length > 4 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-[#e5e7eb] flex items-center justify-center text-xs font-medium text-[#343435]">
              +{task.assignees.length - 4}
            </div>
          )}
        </div>
        <p className="text-[10px] font-light text-[#343435]">
          {task.description}
        </p>
      </div>

      {modal === "assign" && (
        <AssignModal
          isLoading={isLoading}
          assignees={task.assignees}
          contributors={contributors}
          onClose={closeModal}
          onSelect={handleAssign}
        />
      )}
      {modal === "categorize" && (
        <CategorizeModal
          onClose={closeModal}
          onSelect={selectCategory}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
          categories={categories}
          taskCategory={task.category?.name}
        />
      )}
      {modal === "delete" && (
        <DeleteModal onClose={closeModal} onConfirm={confirmDelete} />
      )}
    </>
  );
};

export default TaskCard;
