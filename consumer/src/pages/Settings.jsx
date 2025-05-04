import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addRole, getAllPermissions, getRoles, grantPermission, removePermission } from '../services/services';

import { ClipLoader } from 'react-spinners';

function RoleListItem({ role, isSelected, onSelect }) {
  const baseClasses = "flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left rounded-lg cursor-pointer transition-colors duration-150";
  const selectedClasses = "bg-blue-100 text-blue-700";
  const hoverClasses = "hover:bg-gray-100";
  const normalClasses = "text-gray-700";

  return (
    <button
      onClick={() => onSelect(role)}
      className={`${baseClasses} ${isSelected ? selectedClasses : `${normalClasses} ${hoverClasses}`}`}
    >
      <div className="flex items-center space-x-3">
        <span className={`text-lg ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>👤</span>
        <span>{role.name}</span>
      </div>
    </button>
  );
}

function PermissionItem({ permission, isGranted, onToggle,role }) {
  const grantButtonClasses = "bg-gray-500 hover:bg-gray-600 text-white";
  const removeButtonClasses = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonBaseClasses = "text-xs font-medium px-3 py-1 rounded-full transition-colors duration-150";
  const isStandard = ['read','write','manage'].includes(role?.name)
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3 text-sm text-gray-700">
        <span className="text-gray-500 w-5 text-center">🔒</span>
        <span>{permission.name}</span>
      </div>
      {!isStandard && <button
        onClick={onToggle}
        className={`${buttonBaseClasses} ${isGranted ? removeButtonClasses : grantButtonClasses}`}
      >
        {isGranted ? 'Remove' : 'Grant'}
      </button>}
    </div>
  );
}

function Settings() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedRole,setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles', id],
    queryFn: async () => {
      const res = await getRoles(id);
      return res.data;
    },
  });

  const { data: allPermissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const res = await getAllPermissions();
      return res.data;
    },
  });

  useEffect(() => {
    if (roles.length > 0 && selectedRoleId === null) {
      setSelectedRoleId(roles[0]?.id);
      setSelectedRole(roles[0])
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    const selectedRole = roles.find(role => role.id === selectedRoleId);
    if (selectedRole) {
      const perms = {};
      selectedRole.permissions?.forEach(p => {
        perms[p.name] = true;
      });
      setRolePermissions(perms);
    }
  }, [selectedRoleId, roles]);

  const handleTogglePermission = async (permName, permId, isGranted) => {
    if (!selectedRoleId) return;
    setRolePermissions(prev => ({
      ...prev,
      [permName]: !prev[permName],
    }));
  
    try {
      if (isGranted) {
        const res = await removePermission(id, selectedRoleId, permId);
        
      } else {
        const res = await grantPermission(id,selectedRoleId, permId);
        console.log(res.data);
        
      }
  
      await queryClient.invalidateQueries(['roles', id]);
    } catch (error) {
      console.error(`Failed to ${isGranted ? 'remove' : 'grant'} permission ${permName}:`, error);
    }
  };
  

  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const group = perm.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {});

  const handleAddRoleSubmit = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    setIsAdding(true);
    try {
      console.log(newRoleName.trim());
      
      await addRole(id, { name: newRoleName.trim() });
      setNewRoleName('');
      setShowAddRoleForm(false);
      await queryClient.invalidateQueries(['roles', id]);
    } catch (error) {
      console.error("Failed to add role:", error);
    } finally {
      setIsAdding(false);
    }
  };


  function handleSelectRole(role) {    
    setSelectedRole(role);
    setSelectedRoleId(role.id);
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
      </div>

      {rolesLoading || permissionsLoading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#4f46e5" size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-1 lg:col-span-1 bg-white p-4 rounded-lg border border-gray-200 self-start">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Roles</h2>
              <span className="text-sm text-gray-500">{roles.length} roles</span>
            </div>
            <div className="space-y-2">
              {roles.map(role => (
                <RoleListItem
                  key={role.id}
                  role={role}
                  isSelected={selectedRoleId === role.id}
                  onSelect={handleSelectRole}
                />
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowAddRoleForm(prev => !prev)}
                className="w-full px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm rounded-lg transition cursor-pointer"
              >
                {showAddRoleForm ? 'Cancel' : 'Add Role'}
              </button>

              {showAddRoleForm && (
                <form onSubmit={handleAddRoleSubmit} className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter role name"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    {isAdding ? 'Adding...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg border border-gray-200">
            {Object.entries(groupedPermissions).map(([groupName, perms]) => (
              <div key={groupName} className="mb-8">
                <h3 className="text-base font-semibold text-gray-800 mb-4">{groupName}</h3>
                <div className="divide-y divide-gray-100">
                  {perms.map(perm => (
                   <PermissionItem
                   role= {selectedRole}
                   key={perm.id}
                   permission={perm}
                   isGranted={!!rolePermissions[perm.name]}
                   onToggle={() =>
                     handleTogglePermission(perm.name, perm.id, !!rolePermissions[perm.name])
                   }
                 />
                    
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
