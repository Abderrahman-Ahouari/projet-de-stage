"use client";

import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


// Initial tasks data
const initialTasks = {
  todo: [
    {
      id: "task-1",
      title: "Design Homepage Layout",
      assignee: { name: "John Doe", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due Tomorrow",
      status: "todo",
      priority: "high"
    },
    {
      id: "task-2",
      title: "Implement Authentication",
      assignee: { name: "Sarah Smith", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due in 3 days",
      status: "todo",
      priority: "medium"
    }
  ],
  doing: [
    {
      id: "task-3",
      title: "API Integration",
      assignee: { name: "Mike Johnson", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due Today",
      status: "doing",
      priority: "high"
    }
  ],
  review: [
    {
      id: "task-4",
      title: "Code Review: Login Flow",
      assignee: { name: "Emily Davis", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Due in 2 days",
      status: "review",
      priority: "medium"
    }
  ],
  done: [
    {
      id: "task-5",
      title: "Setup Development Environment",
      assignee: { name: "Alex Wilson", avatar: "/placeholder.svg?height=24&width=24" },
      dueDate: "Completed",
      status: "done",
      priority: "low"
    }
  ]
};

// Task Card Component
const TaskCard = ({ task, moveTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const getStatusColor = (dueDate) => {
    if (dueDate === "Due Tomorrow") return "text-[#ef4444]";
    if (dueDate === "Due Today") return "text-[#f97316]";
    if (dueDate === "Completed") return "text-[#10b981]";
    return "text-[#6b7280]";
  };

  return (
    <div 
      ref={drag} 
      className={`rounded-md border border-[#e5e7eb] bg-white p-4 shadow-sm ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#111827]">{task.title}</h3>
        <button className="text-[#9ca3af]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 overflow-hidden rounded-full">
            <img src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} className="h-full w-full object-cover" />
          </div>
          <span className="text-xs text-[#6b7280]">{task.assignee.name}</span>
        </div>
        <span className={`text-xs font-medium ${getStatusColor(task.dueDate)}`}>{task.dueDate}</span>
      </div>
    </div>
  );
};

// Column Component
const Column = ({ title, tasks, status, moveTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, item.status, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

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
        className={`space-y-4 min-h-[200px] ${isOver ? 'bg-[#f3f4f6] rounded-md' : ''}`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} moveTask={moveTask} />
        ))}
        <button className="flex w-full items-center justify-center rounded-md border border-dashed border-[#e5e7eb] py-3 text-sm text-[#6b7280] hover:bg-[#f3f4f6]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Task
        </button>
      </div>
    </div>
  );
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);

  // Function to move a task from one column to another
  const moveTask = (taskId, sourceStatus, targetStatus) => {
    if (sourceStatus === targetStatus) return;

    setTasks(prevTasks => {
      // Find the task in the source column
      const taskToMove = prevTasks[sourceStatus].find(task => task.id === taskId);
      
      if (!taskToMove) return prevTasks;

      // Create a new task object with updated status
      const updatedTask = { ...taskToMove, status: targetStatus };
      
      // Remove task from source column and add to target column
      return {
        ...prevTasks,
        [sourceStatus]: prevTasks[sourceStatus].filter(task => task.id !== taskId),
        [targetStatus]: [...prevTasks[targetStatus], updatedTask]
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#f9fafb]">
    

        {/* Main Content */}
        <main className="mx-auto max-w-7xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#111827]">Project Kanban Board</h1>
            <button className="flex items-center space-x-1 rounded-md bg-[#ef4444] px-3 py-2 text-sm font-medium text-white hover:bg-[#ef4444]/90">
              <span>Delete Project</span>
            </button>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:grid-cols-4 ">
            <Column 
              title="To Do" 
              tasks={tasks.todo} 
              status="todo" 
              moveTask={moveTask} 
            />
            <Column 
              title="doing" 
              tasks={tasks.doing} 
              status="doing" 
              moveTask={moveTask} 
            />
            <Column 
              title="Review" 
              tasks={tasks.review} 
              status="review" 
              moveTask={moveTask} 
            />
            <Column 
              title="Done" 
              tasks={tasks.done} 
              status="done" 
              moveTask={moveTask} 
            />
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
