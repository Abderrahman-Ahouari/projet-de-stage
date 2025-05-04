"use client"

import { useEffect, useState } from "react"
import { UserPlus, Edit, Trash2 } from "lucide-react"
import { changeRole, deleteContributor, getContributors, getRoles, invite } from "../services/services"
import { Link, useOutletContext, useParams } from "react-router-dom"
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import { ClipLoader } from "react-spinners"
import DeleteModal from "../components/DeleteModal" // Adjust path if needed
import RoleModal from "../components/RoleModal"
import InviteModal from "../components/InviteModal"
import MembersList from "../components/MembersList"
import Swal from "sweetalert2";


export default function ManageTeam() {
  const {permissionsNames} = useOutletContext()
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient()
  const { id } = useParams()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selected, setSelected] = useState(null)
  const [email,setEmail] = useState("");
  const [roleId, setRoleId] = useState("")

  const { data: teamMembers, isLoading: loading, refetch } = useQuery({
    queryKey: ["contributors", id],
    queryFn: async () => {
      const res = await getContributors(id)
      return res.data
    },
    staleTime: 1000 * 60 * .5,
    cacheTime: 1000 * 60 * 60,
  })

  const { data: roles } = useQuery({
    queryKey: ["roles", id],
    queryFn: async () => {
      const res = await getRoles(id);
      return res.data
    },
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 60,
  })

  const openDeleteModal = (userId) => {
    setSelectedUserId(userId)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setSelectedUserId(null)
    setShowDeleteModal(false)
  }

  const handleDeleteMember = async () => {
    if (!selectedUserId) return
    closeDeleteModal()
    queryClient.setQueryData(["contributors", id], (old= []) => old.filter((c) => c.id !== selectedUserId));
    await deleteContributor(id, selectedUserId)
    refetch()
  }
  const handleChangeRole = async (userId,roleId,projectId = id) => {
    if (!selected) return;
    queryClient.setQueryData(["contributors", id], (old) => {
      return old.map((c) => {
        if (c.id === userId) {
          return { ...c, role: roles
            .find(r=>r.id ===roleId) }
        } 
        return c ;
      })})
    const res = await changeRole(id, userId, roleId );
    refetch()
  }

  const toggleInviteModal = () => {
    setShowInviteModal(!showInviteModal)
  }
  function toggleRoleModal(member){
    setSelected(member)
    setShowRoleModal(!showRoleModal)
  }
  async function handleInvite(e) {
    e.preventDefault();
  
    setErrors({});
  
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
  
    if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }
  
    if (!roleId) {
      newErrors.role = "Please select a role.";
    }
  
    const emailExists = teamMembers?.some((member) => member.email === trimmedEmail);
    if (emailExists) {
      newErrors.email = "This user is already a contributor.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    // All validations passed
    setShowInviteModal(false);
  
    try {
      const res = await invite(id, trimmedEmail, roleId);
      setEmail("");
      setRoleId("");
      refetch();
      Swal.fire({
        icon: 'success',
        title: 'Invitation Sent',
        text: `${trimmedEmail} has been successfully invited.`,
        confirmButtonColor: '#2563eb'
      });
    } catch (error) {
      setErrors({ general: "Something went wrong while sending the invitation." });
    }
  }
  
  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
      {/* Header */}
      <Link className=" py-2 block text-blue-400 w-fit" to="/projects">&larr;Return to projects</Link>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Team Management</h1>
          <p className="text-[#6b7280] mt-1">Manage your team members and their roles</p>
        </div>
       {permissionsNames.includes('manage team') && <button
          onClick={toggleInviteModal}
          className="flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] transition-colors cursor-pointer"
        >
          <UserPlus size={20} />
          <span>Invite Member</span>
        </button>}
      </div>

      {/* Team Members Table */}
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <div className="bg-[#f9fafb] p-4 border-b border-[#e5e7eb]">
          <h2 className="font-semibold text-[#111827]">Team Members</h2>
        </div>

        {/* Table Header */}
        <div className={`grid ${permissionsNames.includes('manage team')?'grid-cols-4' : 'grid-cols-3'} gap-4 px-4 py-3 border-b border-[#e5e7eb] text-[#6b7280]`}>
          <div className="text-sm font-medium">Member</div>
          <div className="text-sm font-medium">Role</div>
          <div className="text-sm font-medium">Status</div>
          {permissionsNames.includes('manage team') && <div className="text-sm font-medium text-right">Delete</div>}
        </div>

        {loading && (
          <div className="flex justify-center items-center h-32">
            <ClipLoader color="#4f46e5" size={50} />
          </div>
        )}

        {!loading &&
          <MembersList teamMembers={teamMembers} openDeleteModal={openDeleteModal} toggleRoleModal={toggleRoleModal} />
        }
      </div>

      {/* Invite Modal (simplified) */}
      {showInviteModal && (
  <InviteModal errors={errors}  email={email} setEmail={setEmail}   roleId={roleId} setRoleId={setRoleId}  roles={roles}  toggleInviteModal= {toggleInviteModal} handleInvite={handleInvite}/>
)}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal onClose={closeDeleteModal} onConfirm={handleDeleteMember} />
      )}
      {showRoleModal && (
        <RoleModal roles={roles} selected={selected}  setShowRoleModal={setShowRoleModal}  onSelect={handleChangeRole} />
      )}
      
    </div>
  )
}
