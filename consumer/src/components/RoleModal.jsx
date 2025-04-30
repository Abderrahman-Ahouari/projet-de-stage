import React, { useState } from 'react';

export default function RoleModal({onSelect, roles, selected,setShowRoleModal }) {
  const loading = false; // Assume no loading state for simplicity here

  const handleRoleSelect = async (role) => {
    if (role.name === selected.role.name) {
      return;
    }
    setShowRoleModal(false);
    await onSelect(selected.id,role.id);
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
      <div className="relative bg-white rounded-lg w-64 max-h-80 p-4">
        <h2 className="text-lg font-medium mb-4">Select Role</h2>

        <div className="bg-white rounded-lg max-h-40 overflow-auto p-4 gap-1 flex flex-col">
          {roles.filter(role=>role.name !=='admin').map((role) => (
            <button
              key={role.id}
              className={`block w-full text-left px-3 py-2 rounded cursor-pointer ${selected.role.name === role.name ? 'bg-blue-500 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => handleRoleSelect(role)}
            >
              {role.name}
            </button>
          ))}
        </div>


        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer w-full"
          onClick={()=>setShowRoleModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
