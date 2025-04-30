import { useEffect, useState } from "react";
import ProjectsList from "../components/ProjectsList";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";
import { createProject, getProjects } from "../services/services";
import { useQueryClient, useQuery } from "@tanstack/react-query";

function Projects() {
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState(()=>+localStorage.getItem("activeProjectsTab") || 0);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [formError, setFormError] = useState("");
  const queryClient = useQueryClient();

  const handleTabChange = (index) => {
    setTab(index);
    localStorage.setItem("activeProjectsTab", index);
  
    
    
  };

  const openForm = () => {
    setShowForm(true);
    setTitle("");
    setDescription("");
    setDeadline("");
    setFormError("");
  };
  const closeForm = () => setShowForm(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }

    const selectedDate = new Date(deadline);
    const today = new Date(new Date().toDateString());

    if (selectedDate < today) {
      setFormError("Deadline cannot be in the past");
      return;
    }

    const newProject = {
      id: Date.now(), 
      title: title.trim(),
      description,
      deadline,
      createdAt: new Date().toISOString(), 
      tasks : [],
      contributors : []
    };

    queryClient.setQueryData(["projects"], (old) =>({ ...old,projects: [newProject,...old.projects] }));
  
    try {
      closeForm();
      await createProject({ title: title.trim(), description, deadline });
      queryClient.invalidateQueries(["projects"]);
      setTab(0);
    } catch (err) {
      setFormError(err.message || "Failed to create project");
    }
  };
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res1 = await getProjects();
      const res2 = await getProjects(true);
      return { projects: res1.data, sharedProjects: res2.data };
    },
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 1, 
    cacheTime: 1000 * 60 * 60,
  });
  const projects = data?.projects || [];
  const sharedProjects = data?.sharedProjects || [];
  return (
    <div className="min-h-screen bg-white relative">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#111827]">My Projects</h1>
          <button
            onClick={openForm}
            className="bg-[#4f46e5] cursor-pointer hover:bg-[#4338ca] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span className="font-medium">+</span>
            <span className="font-medium">New Project</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#e5e7eb] mb-6">
          <button
            className={`text-black font-medium ${
              !tab && "border-b-2 border-[#4f46e5]"
            } pb-3 cursor-pointer`}
            onClick={() => handleTabChange(0)}
          >
            My Projects
            <span className="bg-[#e0e7ff] text-[#4f46e5] text-xs font-medium px-2 py-0.5 rounded-full ml-2">
              {projects.length}
            </span>
          </button>
          <button
            className={`text-black font-medium ${
              tab && "border-b-2 border-[#4f46e5]"
            } pb-3 cursor-pointer`}
            onClick={() => handleTabChange(1)}
          >
            Shared with me
            <span className="bg-[#f3f4f6] text-[#6b7280] text-xs font-medium px-2 py-0.5 rounded-full ml-2">
              {sharedProjects.length}
            </span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <ClipLoader loading={loading} size={50} color="#3B82F6" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        <ProjectsList projects={!tab ? projects : sharedProjects} />
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">New Project</h2>

            <label className="block mb-2 text-sm font-medium">
              Title <span className="text-red-500">*</span>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (formError) setFormError("");
                }}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>

            <label className="block mb-2 text-sm font-medium">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </label>

            <label className="block mb-4 text-sm font-medium">
              Deadline
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>

            {formError && (
              <p className="text-red-600 text-sm mb-4">{formError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded  cursor-pointer`}
                disabled={loading}
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Projects;
