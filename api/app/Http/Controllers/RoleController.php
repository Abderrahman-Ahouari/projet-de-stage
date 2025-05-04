<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Project;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{

    public function index(Project $project)
    {
        $roles = $project->roles()
        ->with('permissions')
        ->where('name', '!=', 'admin')
        ->get();


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






    public function destroy(Role $role ,Project $project)
    {
        $this->authorize('manageRoles', $project);
        $project->roles()->delete();
        return response()->json(null, 204);
    }

    public function grant(Project $project ,Role $role,Request $request){

        $this->authorize('manageRoles', $project);
        if(in_array($role->name,['read','write','manage'])) return;
        $data = $request->validate(
            [
                'id' => 'required|exists:permissions,id'
            ]
            );
        $role->permissions()->attach($data['id']);
        return response()->json();

    }
    public function remove(Project $project ,Role $role,Request $request){

        $this->authorize('manageRoles', $project);
        if(in_array($role->name,['read','write','manage'])) return;
        $data = $request->validate(
            [
                'id' => 'required|exists:permissions,id'
            ]
            );
        $role->permissions()->detach($data['id']);
        return response()->json();

    }
}
