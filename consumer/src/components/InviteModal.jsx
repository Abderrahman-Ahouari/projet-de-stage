


export default function InviteModal({ errors, email, setEmail,roleId,setRoleId,roles,toggleInviteModal,handleInvite }) {
  

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
      <div className="space-y-4">
        {errors.general && (
          <p className="text-red-600 text-sm">{errors.general}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            className={`w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value="">-- Select a role --</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-red-600 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={toggleInviteModal}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="px-4 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#1e40af] cursor-pointer"
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  </div>
    )
}