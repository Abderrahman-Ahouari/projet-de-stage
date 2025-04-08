"use client"

import { useState } from "react"
import { UserPlus, Edit, Trash2 } from "lucide-react"

// Sample team members data
const initialTeamMembers = [
  {
    id: 1,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "manage",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "write",
    status: "active",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "read",
    status: "inactive",
  },
]

export default function ManageTeam() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const getRoleBadgeStyles = (role) => {
    switch (role) {
      case "manage":
        return "bg-[#dbeafe] text-[#1e40af]"
      case "write":
        return "bg-[#ede9fe] text-[#5b21b6]"
      case "read":
        return "bg-[#fef3c7] text-[#92400e]"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const handleDeleteMember = (id) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id))
    }
  }

  const toggleInviteModal = () => {
    setShowInviteModal(!showInviteModal)
  }

  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Team Management</h1>
          <p className="text-[#6b7280] mt-1">Manage your team members and their roles</p>
        </div>
        <button
          onClick={toggleInviteModal}
          className="flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] transition-colors"
        >
          <UserPlus size={20} />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Members Table */}
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <div className="bg-[#f9fafb] p-4 border-b border-[#e5e7eb]">
          <h2 className="font-semibold text-[#111827]">Team Members</h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-[#e5e7eb] text-[#6b7280]">
          <div className="text-sm font-medium">Member</div>
          <div className="text-sm font-medium">Role</div>
          <div className="text-sm font-medium">Status</div>
          <div className="text-sm font-medium text-right">Actions</div>
        </div>

        {/* Table Rows */}
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-4 gap-4 px-4 py-4 border-b border-[#e5e7eb] items-center last:border-b-0"
          >
            {/* Member */}
            <div className="flex items-center gap-3">
              <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-medium text-[#111827]">{member.name}</div>
                <div className="text-sm text-[#6b7280]">{member.email}</div>
              </div>
            </div>

            {/* Role */}
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${getRoleBadgeStyles(member.role)}`}
              >
                {member.role}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  member.status === "active" ? "bg-[#059669]" : "bg-[#6b7280]"
                }`}
              ></span>
              <span className={`capitalize ${member.status === "active" ? "text-[#059669]" : "text-[#6b7280]"}`}>
                {member.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                className="p-1.5 text-[#6b7280] hover:text-[#111827] rounded-md hover:bg-[#f9fafb]"
                aria-label="Edit member"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="p-1.5 text-[#6b7280] hover:text-red-500 rounded-md hover:bg-[#f9fafb]"
                aria-label="Delete member"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal (simplified) */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="read">Read</option>
                  <option value="write">Write</option>
                  <option value="manage">Manage</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={toggleInviteModal}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#1e40af]">
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}