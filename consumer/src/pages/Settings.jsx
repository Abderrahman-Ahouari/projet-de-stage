import React, { useState, useEffect } from 'react';

// Sample data
const initialRoles = [
  { id: 'manage', name: 'Manage', icon: '🛡️', isDefault: true },
  { id: 'write', name: 'Write', icon: '✏️', isDefault: true },
  { id: 'read', name: 'Read', icon: '👁️', isDefault: true },
  { id: 'custom', name: 'Support Tier 1', icon: '🎧', isDefault: false }, // Example custom role
];

// Define all possible permissions structure
const permissionSchema = [
  {
    group: 'Users Management',
    permissions: [
      { id: 'createUser', name: 'Create Users', icon: '👤+' },
      { id: 'editUser', name: 'Edit Users', icon: '👤✏️' },
      { id: 'deleteUser', name: 'Delete Users', icon: '👤-' },
    ]
  },
  {
    group: 'Content Management',
    permissions: [
      { id: 'createContent', name: 'Create Content', icon: '📄+' },
      { id: 'editContent', name: 'Edit Content', icon: '📄✏️' },
      { id: 'deleteContent', name: 'Delete Content', icon: '🗑️' },
    ]
  },
  {
    group: 'Settings Management',
    permissions: [
      { id: 'viewSettings', name: 'View Settings', icon: '⚙️' },
      { id: 'modifySettings', name: 'Modify Settings', icon: '📊' }, // Using a different icon placeholder
    ]
  }
];

const initialRolePermissions = {
  manage: {
    createUser: true, editUser: true, deleteUser: false,
    createContent: true, editContent: true, deleteContent: true,
    viewSettings: true, modifySettings: true,
  },
  write: {
    createUser: false, editUser: false, deleteUser: false,
    createContent: true, editContent: true, deleteContent: false,
    viewSettings: true, modifySettings: false,
  },
  read: {
    createUser: false, editUser: false, deleteUser: false,
    createContent: false, editContent: false, deleteContent: false,
    viewSettings: true, modifySettings: false,
  },
  custom: { // Initial state for a new/custom role
    createUser: false, editUser: false, deleteUser: false,
    createContent: false, editContent: false, deleteContent: false,
    viewSettings: false, modifySettings: false,
  },
};

function RoleListItem({ role, isSelected, onSelect }) {
  const baseClasses = "flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left rounded-lg cursor-pointer transition-colors duration-150";
  const selectedClasses = "bg-blue-100 text-blue-700";
  const hoverClasses = "hover:bg-gray-100";
  const normalClasses = "text-gray-700";

  return (
    <button
      onClick={() => onSelect(role.id)}
      className={`${baseClasses} ${isSelected ? selectedClasses : `${normalClasses} ${hoverClasses}`}`}
    >
      <div className="flex items-center space-x-3">
        <span className={`text-lg ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>{role.icon}</span>
        <span>{role.name}</span>
      </div>
      {role.isDefault && (
        <span className="text-xs font-normal bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
          Default
        </span>
      )}
    </button>
  );
}

function PermissionItem({ permission, isGranted, onToggle }) {
  const grantButtonClasses = "bg-gray-500 hover:bg-gray-600 text-white";
  const removeButtonClasses = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonBaseClasses = "text-xs font-medium px-3 py-1 rounded-full transition-colors duration-150";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3 text-sm text-gray-700">
        <span className="text-gray-500 w-5 text-center">{permission.icon}</span>
        <span>{permission.name}</span>
      </div>
      <button
        onClick={onToggle}
        className={`${buttonBaseClasses} ${isGranted ? removeButtonClasses : grantButtonClasses}`}
      >
        {isGranted ? 'Remove' : 'Grant'}
      </button>
    </div>
  );
}

function PermissionGroup({ title, permissions, rolePermissions, onTogglePermission }) {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="divide-y divide-gray-100">
        {permissions.map((perm) => (
          <PermissionItem
            key={perm.id}
            permission={perm}
            isGranted={!!rolePermissions[perm.id]} // Ensure boolean value
            onToggle={() => onTogglePermission(perm.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoles[0]?.id || null); // Select first role initially
  const [permissions, setPermissions] = useState(initialRolePermissions);
  const [currentPermissions, setCurrentPermissions] = useState({});

  useEffect(() => {
    if (selectedRoleId && permissions[selectedRoleId]) {
      setCurrentPermissions(permissions[selectedRoleId]);
    } else {
      setCurrentPermissions({}); // Clear if no role selected or no permissions found
    }
  }, [selectedRoleId, permissions]);

  const handleSelectRole = (roleId) => {
    setSelectedRoleId(roleId);
  };

  const handleTogglePermission = (permissionId) => {
    if (!selectedRoleId) return;

    // Create a *new* permissions object to update state immutably
    setPermissions(prevPermissions => {
      const updatedRolePermissions = {
        ...prevPermissions[selectedRoleId], // Copy permissions for the current role
        [permissionId]: !prevPermissions[selectedRoleId][permissionId], // Toggle the specific permission
      };
      return {
        ...prevPermissions, // Copy all role permissions
        [selectedRoleId]: updatedRolePermissions, // Update the specific role's permissions
      };
    });
  };

  const handleSaveChanges = () => {
    console.log('Saving changes for role:', selectedRoleId, currentPermissions);
    alert('Changes Saved (check console)!');
  };

  const handleCancel = () => {
    if (selectedRoleId) {
      setCurrentPermissions(initialRolePermissions[selectedRoleId] || {});
    }
    alert('Changes Canceled!');
  };

  const handleCreateNewRole = () => {
    alert('Create New Role Clicked');
  };

  const selectedRole = roles.find(role => role.id === selectedRoleId);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
        <button
          onClick={handleCreateNewRole}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Role
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Left Column: Roles List */}
        <div className="md:col-span-1 lg:col-span-1 bg-white p-4 rounded-lg border border-gray-200 self-start">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Roles</h2>
            <span className="text-sm text-gray-500">{roles.length} roles</span>
          </div>
          <div className="space-y-2">
            {roles.map((role) => (
              <RoleListItem
                key={role.id}
                role={role}
                isSelected={selectedRoleId === role.id}
                onSelect={handleSelectRole}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Permissions */}
        <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Permissions for "{selectedRole?.name}"</h3>
          {selectedRoleId && permissionSchema.map((group) => (
            <PermissionGroup
              key={group.group}
              title={group.group}
              permissions={group.permissions}
              rolePermissions={currentPermissions}
              onTogglePermission={handleTogglePermission}
            />
          ))}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
