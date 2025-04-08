import ProjectCard from "../components/ProjectCard"

// Fake projects data
const projects = [
  {
    id: 1,
    icon: "website",
    title: "Website Redesign",
    description: "Complete overhaul of the company website with modern design system",
    users: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    timeLeft: "2 days left",
    tasks: { completed: 12, total: 15 },
    progress: 80,
    progressColor: "blue",
  },
  {
    id: 2,
    icon: "mobile",
    title: "Mobile App",
    description: "Native mobile application for iOS and Android platforms",
    users: ["/placeholder.svg", "/placeholder.svg"],
    timeLeft: "1 week left",
    tasks: { completed: 8, total: 20 },
    progress: 40,
    progressColor: "purple",
  },
  {
    id: 3,
    icon: "analytics",
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard with interactive charts",
    users: ["/placeholder.svg", "/placeholder.svg"],
    timeLeft: "5 days left",
    tasks: { completed: 15, total: 18 },
    progress: 85,
    progressColor: "green",
  },
  {
    id: 4,
    icon: "mobile",
    title: "Mobile App",
    description: "Native mobile application for iOS and Android platforms",
    users: ["/placeholder.svg", "/placeholder.svg"],
    timeLeft: "1 week left",
    tasks: { completed: 8, total: 20 },
    progress: 40,
    progressColor: "purple",
  },
  {
    id: 5,
    icon: "mobile",
    title: "Mobile App",
    description: "Native mobile application for iOS and Android platforms",
    users: ["/placeholder.svg", "/placeholder.svg"],
    timeLeft: "1 week left",
    tasks: { completed: 8, total: 20 },
    progress: 40,
    progressColor: "purple",
  },
  {
    id: 6,
    icon: "mobile",
    title: "Mobile App",
    description: "Native mobile application for iOS and Android platforms",
    users: ["/placeholder.svg", "/placeholder.svg"],
    timeLeft: "1 week left",
    tasks: { completed: 8, total: 20 },
    progress: 40,
    progressColor: "purple",
  },
]

function Projects() {
  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#111827]">My Projects</h1>
          <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="font-medium">+</span>
            <span className="font-medium">New Project</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#e5e7eb] mb-6">
          <button className="text-[#111827] font-medium border-b-2 border-[#4f46e5] pb-3 flex items-center gap-2">
            My Projects
            <span className="bg-[#e0e7ff] text-[#4f46e5] text-xs font-medium px-2 py-0.5 rounded-full">5</span>
          </button>
          <button className="text-[#6b7280] font-medium pb-3 flex items-center gap-2">
            Shared with me
            <span className="bg-[#f3f4f6] text-[#6b7280] text-xs font-medium px-2 py-0.5 rounded-full">3</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              icon={project.icon}
              title={project.title}
              description={project.description}
              users={project.users}
              timeLeft={project.timeLeft}
              tasks={project.tasks}
              progress={project.progress}
              progressColor={project.progressColor}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Projects;