import { Trash2 } from "lucide-react";


export default function MembersList({ teamMembers,openDeleteModal,toggleRoleModal }) {


    return (
        <>
        {teamMembers?.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-4 gap-4 px-4 py-4 border-b border-[#e5e7eb] items-center last:border-b-0"
            >
              {/* Member */}
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.username} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium text-[#111827]">{member.username}</div>
                  <div className="text-sm text-[#6b7280]">{member.email}</div>
                </div>
              </div>

              {/* Role */}
              <div>
                <button
                  onClick={()=>toggleRoleModal(member)}
                  className={`inline-block px-3 py-1 rounded-full text-sm capitalize bg-blue-200 text-blue-700 cursor-pointer`}
                >
                  {member.role.name}
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    member.status ? "bg-[#059669]" : "bg-[#6b7280]"
                  }`}
                ></span>
                <span className={`capitalize ${member.status ? "text-[#059669]" : "text-[#6b7280]"}`}>
                  {member.status ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                
                <button
                  onClick={() => openDeleteModal(member.id)}
                  className="p-1.5 text-[#6b7280] hover:text-red-500 rounded-md hover:bg-[#f9fafb] cursor-pointer"
                  aria-label="Delete member"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </>
    )
}