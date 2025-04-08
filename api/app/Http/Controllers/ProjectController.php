<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Project;
use App\Models\Role;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function admin(Project $project){
        $admin = $project->admin;
        return response()->json($admin);

    }

    public function index()
    {
        $projects = Project::paginate(10);
        if ($projects->isEmpty()) {
            return response()->json([
                'message' => 'No projects found'
            ], 404);
        }
        return response()->json($projects);
    }


    public function userProjects(Request $request){
        $projects = $request->user()->projects;
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:20',
            'description' => 'string|max:255',
        ]);
        $project = Project::create($data);
        if($project){
            Contribution::create([
                'role_id' => Role::where('name', 'admin')->first()->id,
                'user_id' => $request->user()->id,
                'project_id' => $project->id,
            ]);
        }
        return response()->json(['project' => $project], 201);
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }



    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($validated);

        return response()->json(['message' => 'Project updated successfully', 'project' => $project], 200);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}
