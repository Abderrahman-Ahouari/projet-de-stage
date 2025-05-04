import { useIsFetching } from "@tanstack/react-query"
import { useEffect } from "react"
import { Link } from "react-router-dom"

function ProjectCard({project}) {


    const getProgressColor = () => {
      switch (project.progressColor) {
        case "blue":
          return "bg-[#2563eb]"
        case "purple":
          return "bg-[#7c3aed]"
        case "green":
          return "bg-[#059669]"
        default:
          return "bg-[#4f46e5]"
      }
    }
    const total = project.tasks?.filter(task=>task.status === 'done').length
    const progress = total/(project.tasks?.length) * 100

    const timeStamp = new Date(project.deadline) - new Date(new Date().toLocaleDateString());
    let leftDays = timeStamp/(1000*60*60*24);
    leftDays = leftDays<0 ? `deadline missed` : leftDays === 0 ? 'due today' : `${leftDays} days left`
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          
        </div>
  
        <h3 className="font-medium text-lg text-[#111827] mb-2">{project.title}</h3>
        <p className="text-sm text-[#6b7280] mb-4">{project.description}</p>
  
        <div className="flex justify-between items-center mb-4">
          <div className="flex -space-x-2">
            {project.contributors.map((user, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#e5e7eb] overflow-hidden">
                <img src={user.avatar} alt="Team member" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex items-center text-sm text-[#6b7280]">
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
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {leftDays} 
          </div>
        </div>
  
        <div className="flex items-center text-sm text-[#6b7280] mb-2">
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
            className="mr-2"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          {project.tasks.filter(task=>task.status === 'done').length}/{project.tasks.length} tasks
        </div>
        <div className="flex w-full">
          <Link className="ml-auto hover:text-blue-400 pb-3" to={`/projects/${project.id}/kanban`}>Kanban&rarr;</Link>
        </div>
        <div className="w-full h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
          <div className={`h-full ${getProgressColor()} rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    )
  }
  
  export default ProjectCard
  
  