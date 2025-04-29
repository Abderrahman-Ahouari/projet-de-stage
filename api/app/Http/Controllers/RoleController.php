<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{

    public function index(Project $project)
    {
        $project->load('roles');
        $roles = $project->roles->filter(function ($role) {
            return $role->name !== 'admin';
        })->values();

        return response()->json($roles);
    }


    public function store(Request $request ,Project $project)
    {
        $this->authorize('manageRoles', $project);
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $role = $project->roles()->create($request->all());
        return response()->json($role, 201);
    }




    public function update(Request $request, Role $role,Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    }

    public function destroy(Role $role ,Project $project)
    {
        $this->authorize('manageRoles', $project);
        $project->roles()->delete();
        return response()->json(null, 204);
    }
}
