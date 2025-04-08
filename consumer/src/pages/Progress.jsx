"use client"

import { useState } from "react"

// Using the provided initial tasks data
const initialTasks = {
  todo: [
    {
      id: "task-1",
      title: "Design Homepage Layout",
      assignee: { name: "John Doe", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due Tomorrow",
      status: "todo",
      priority: "high",
    },
    {
      id: "task-2",
      title: "Implement Authentication",
      assignee: { name: "Sarah Smith", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due in 3 days",
      status: "todo",
      priority: "medium",
    },
  ],
  doing: [
    {
      id: "task-3",
      title: "API Integration",
      assignee: { name: "Mike Johnson", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due Today",
      status: "doing",
      priority: "high",
    },
  ],
  review: [
    {
      id: "task-4",
      title: "Code Review: Login Flow",
      assignee: { name: "Emily Davis", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due in 2 days",
      status: "review",
      priority: "medium",
    },
  ],
  done: [
    {
      id: "task-5",
      title: "Setup Development Environment",
      assignee: { name: "Alex Wilson", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Completed",
      status: "done",
      priority: "low",
    },
  ],
}

// Additional project data
const projectData = {
  name: "Website Redesign",
  totalTasks: 60,
  completedTasks: 45,
  inProgressTasks: 12,
  timeRemaining: "15d",
  overallProgress: 75,
  teamMembers: [
    { id: 1, name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40", progress: 92 },
    { id: 2, name: "Michael Chen", avatar: "/placeholder.svg?height=40&width=40", progress: 78 },
    { id: 3, name: "Emma Davis", avatar: "/placeholder.svg?height=40&width=40", progress: 85 },
  ],
  milestones: [
    { id: 1, name: "Design Phase", status: "completed", date: "Completed on March 15, 2025" },
    { id: 2, name: "Development Sprint 1", status: "in-progress", date: "In Progress · Due April 5, 2025" },
    { id: 3, name: "Testing Phase", status: "upcoming", date: "Starting April 10, 2025" },
  ],
  taskGroups: [
    { id: 1, name: "Frontend Tasks", completed: 16, total: 20, progress: 80, daysLeft: 3 },
    { id: 2, name: "Backend Tasks", completed: 13, total: 20, progress: 65, daysLeft: 5 },
    { id: 3, name: "QA Tasks", completed: 9, total: 20, progress: 45, daysLeft: 7 },
  ],
}

export default function Progress() {
  const [project] = useState(projectData)

  return (
    <div className="bg-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Project Progress Overview</h1>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Overall Progress */}
        <div className="bg-[#f5f3ff] p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-[#7c3aed]">Overall Progress</span>
            <span className="text-[#7c3aed] text-2xl font-bold">{project.overallProgress}%</span>
          </div>
          <div className="w-full bg-[#ddd6fe] rounded-full h-2.5">
            <div className="bg-[#7c3aed] h-2.5 rounded-full" style={{ width: `${project.overallProgress}%` }}></div>
          </div>
        </div>

        {/* Tasks Completed */}
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
              style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-[#fffbeb] p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-[#d97706]">In Progress</span>
            <span className="text-[#d97706] text-2xl font-bold">{project.inProgressTasks}</span>
          </div>
          <div className="w-full bg-[#fde68a] rounded-full h-2.5">
            <div
              className="bg-[#d97706] h-2.5 rounded-full"
              style={{ width: `${(project.inProgressTasks / project.totalTasks) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="bg-[#eef2ff] p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-[#4f46e5]">Time Remaining</span>
            <span className="text-[#4f46e5] text-2xl font-bold">{project.timeRemaining}</span>
          </div>
          <div className="w-full bg-[#c7d2fe] rounded-full h-2.5">
            <div className="bg-[#4f46e5] h-2.5 rounded-full" style={{ width: "65%" }}></div>
          </div>
        </div>
      </div>

      {/* Team Members and Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Team Members Progress */}
        <div>
          <h2 className="text-xl font-bold mb-4">Team Members Progress</h2>
          <div className="space-y-4">
            {project.teamMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-[#4f46e5] font-medium">{member.progress}%</span>
                  </div>
                  <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                    <div className="bg-[#4f46e5] h-2 rounded-full" style={{ width: `${member.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Progress */}
        <div>
          <h2 className="text-xl font-bold mb-4">Milestone Progress</h2>
          <div className="space-y-4">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="flex space-x-3">
                <div className="min-w-[4px] bg-gray-200 relative">
                  <div
                    className={`absolute top-0 left-0 w-full ${
                      milestone.status === "completed"
                        ? "bg-[#10b981] h-full"
                        : milestone.status === "in-progress"
                          ? "bg-[#f59e0b] h-1/2"
                          : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{milestone.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        milestone.status === "completed"
                          ? "bg-[#d1fae5] text-[#059669]"
                          : milestone.status === "in-progress"
                            ? "bg-[#fef3c7] text-[#d97706]"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {milestone.status === "completed"
                        ? "Completed"
                        : milestone.status === "in-progress"
                          ? "In Progress"
                          : "Upcoming"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Groups Progress */}
      <div>
        <h2 className="text-xl font-bold mb-4">Task Groups Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {project.taskGroups.map((group) => (
            <div key={group.id} className="border border-[#e5e7eb] rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{group.name}</h3>
                <span className="text-[#4f46e5] font-medium">{group.progress}%</span>
              </div>
              <div className="w-full bg-[#e5e7eb] rounded-full h-2 mb-2">
                <div className="bg-[#4f46e5] h-2 rounded-full" style={{ width: `${group.progress}%` }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {group.completed}/{group.total} tasks
                </span>
                <span>{group.daysLeft} days left</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}