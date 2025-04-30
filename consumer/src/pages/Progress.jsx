"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect} from "react";
import { data, Link, useParams } from "react-router-dom";
import { getProject } from "../services/services";
import { ClipLoader } from "react-spinners";

function adaptProject(project) {
  const newProject = {};
  const tasksCount = project.tasks.length;
  const done = project.tasks.filter((task) => task.status === "done").length;
  const doing = project.tasks.filter((task) => task.status === "doing" || task.status==="review").length;
  newProject.overallProgress = tasksCount ? Math.round((done / tasksCount) * 100) : 0;
  newProject.totalTasks = tasksCount;
  newProject.completedTasks = done;
  newProject.inProgressTasks = doing;
  const time =Math.trunc((new Date(project.deadline) - new Date(new Date().toLocaleDateString())) / (1000 * 60 * 60 * 24));
  newProject.timeRemaining = time >= 0 ? time : 'time is over';
  newProject.contributors = project.contributors.map((contributor) => {
    return {
      ...contributor,
      progress: contributor.tasks.length
        ? Math.trunc((contributor.tasks.filter((task) => task.status === "done").length /
          contributor.tasks.length) * 100)
        : 0,
        hasTasks : contributor.tasks.length > 0,
    };
  });
  newProject.categories = project.categories.map((category) => {
    return {
      ...category,
      progress: category.tasks.length
        ? Math.trunc((category.tasks.filter((task) => task.status === "done").length /
          category.tasks.length) * 100)
        : 0,
      totalTasks: category.tasks.length,
      completedTasks: category.tasks.filter((task) => task.status === "done").length,
      hasTasks : category.tasks.length > 0,

    };
  });
  return newProject
}

export default function Progress() {
  const id = useParams().id;
  const {
    data = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      const res = await getProject(id);
      return res.data;
    },
    staleTime: 1000 * 60 * 1, // Cache data for 5 minutes
  cacheTime: 1000 * 60 * 60,
  });


  const project =  data && data.tasks ? adaptProject(data) : null;

  return (
    <div className="bg-white p-6 rounded-lg">
       <Link className=" py-2 block text-blue-400 w-fit" to="/projects">&larr;Return to projects</Link>
      <h1 className="text-2xl font-bold mb-6">Project Progress Overview</h1>
      {isLoading && (
          <div className="flex justify-center items-center h-32">
            <ClipLoader  size={50} color="#3B82F6" />
          </div>
        )}

 
      {!isLoading && <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

<div className="bg-[#f5f3ff] p-4 rounded-lg">
  <div className="flex justify-between mb-2">
    <span className="text-[#7c3aed]">Overall Progress</span>
    <span className="text-[#7c3aed] text-2xl font-bold">
      {project.overallProgress}%
    </span>
  </div>
  <div className="w-full bg-[#ddd6fe] rounded-full h-2.5">
    <div
      className="bg-[#7c3aed] h-2.5 rounded-full"
      style={{ width: `${project.overallProgress}%` }}
    ></div>
  </div>
</div>


<div className="bg-[#ecfdf5] p-4 rounded-lg">
  <div className="flex justify-between mb-2">
    <span className="text-[#059669]">Tasks Completed</span>
    <span className="text-[#059669] text-2xl font-bold">
      {project.completedTasks}/{project.totalTasks}
    </span>
  </div>
  <div className="w-full bg-[#a7f3d0] rounded-full h-2.5">
    <div
      className="bg-[#059669] h-2.5 rounded-full"
      style={{
        width: `${
          (project.completedTasks / project.totalTasks) * 100
        }%`,
      }}
    ></div>
  </div>
</div>


<div className="bg-[#fffbeb] p-4 rounded-lg">
  <div className="flex justify-between mb-2">
    <span className="text-[#d97706]">In Progress</span>
    <span className="text-[#d97706] text-2xl font-bold">
      {project.inProgressTasks}
    </span>
  </div>
  <div className="w-full bg-[#fde68a] rounded-full h-2.5">
    <div
      className="bg-[#d97706] h-2.5 rounded-full"
      style={{
        width: `${
          (project.inProgressTasks / project.totalTasks) * 100
        }%`,
      }}
    ></div>
  </div>
</div>

<div className="bg-[#eef2ff] p-4 rounded-lg">
  <div className=" mb-2">
    <span className="text-[#4f46e5]">Time Remaining :</span>
    <p className="text-[#4f46e5] text-2xl font-bold  pl-3">
      {project.timeRemaining} days
    </p>
  </div>
  
</div>
</div>


<div className="md:flex gap-8 mb-8 ">
  {/* Team Members Progress */}
  <div className="md:w-1/2 mb-8 md:mb-0">
    <h2 className="text-xl font-bold mb-4">Team Members Progress</h2>
    <div className="space-y-4">
      {project.contributors.filter(c => c.hasTasks).map((member) => (
        <div key={member.id} className="flex items-center space-x-3">
          <img
            src={member.avatar || "/placeholder.svg"}
            alt={member.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{member.username}</span>
              <span className="text-[#4f46e5] font-medium">
                {member.progress}%
              </span>
            </div>
            <div className="w-full bg-[#e5e7eb] rounded-full h-2">
              <div
                className="bg-[#4f46e5] h-2 rounded-full"
                style={{ width: `${member.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Task Groups Progress */}
  <div className="md:w-1/2 ">
    <h2 className="text-xl font-bold mb-4">Task Groups Progress</h2>
    <div className="space-y-4 max-h-56 overflow-y-auto">
      {project.categories.filter(cat=>cat.hasTasks).map((category) => (
        <div
          key={category.id}
          className="border border-[#e5e7eb] rounded-lg p-4"
        >
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">{category.name}</h3>
            <span className="text-[#4f46e5] font-medium">
              {category?.progress}%
            </span>
          </div>
          <div className="w-full bg-[#e5e7eb] rounded-full h-2 mb-2">
            <div
              className="bg-[#4f46e5] h-2 rounded-full"
              style={{ width: `${category.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {category?.completedTasks}/{category.totalTasks} tasks
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      </div>}
    </div>
  );
}
