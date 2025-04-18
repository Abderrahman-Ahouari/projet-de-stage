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
        $projects = Project::with('contributors')->paginate(10);
        if ($projects->isEmpty()) {
            return response()->json([
                'message' => 'No projects found'
            ], 404);
        }
        $projects->load('roles');
        $projects->load('categories');
        return response()->json($projects);
    }

    public function show(Project $project){
        $project->load(['contributors', 'tasks', 'categories.tasks', 'roles']);
    foreach ($project->contributors as $contributor) {
        $contributor->setRelation('tasks', $contributor->tasks($project->id)->get());
    }
        return response()->json($project);
    }

    public function userProjects(Request $request){
        $projects = $request->user()->ownProjects;
        $projects->load('contributors','tasks');
        return response()->json($projects);
    }
    public function sharedProjects(Request $request){
        $projects = $request->user()->sharedProjects;
        $projects->load('contributors','tasks');
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        // return response()->json($request->all());
        $data = $request->validate([
            'title' => 'required|string|max:20',
            'description' => 'string|max:255',
            'deadline' => 'required|date|after_or_equal:today'
        ]);
        $project = Project::create($data);
        if($project)
        $request->user()->ownProjects()->attach($project,['role_id'=>1]);
        return response()->json(['project' => $project], 201);
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
