<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaskController extends Controller
{

    public function index(Project $project)
    {
        $tasks = $project->tasks; 

        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage for a specific project.
     */
    public function store(Request $request, Project $project)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,doing,review,done',
            'category_id' => 'nullable|uuid|exists:categories,id',
        ]);

        // Create a new task and associate it with the project
        $task = $project->tasks()->create($validated);

        // Return the newly created task
        return response()->json($task, 201);
    }


    public function show(Project $project, Task $task)
    {
        // Check if the task belongs to the specified project
        if ($task->project_id !== $project->id) {
            return response()->json(['message' => 'Task not found in this project.'], 404);
        }

        // Return the task as a JSON response
        return response()->json($task);
    }


    public function update(Request $request, Project $project, Task $task)
    {
        // Check if the task belongs to the specified project
        if ($task->project_id !== $project->id) {
            return response()->json(['message' => 'Task not found in this project.'], 404);
        }

        // Validate the incoming request data
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:todo,doing,review,done',
            'category_id' => 'nullable|uuid|exists:categories,id',
        ]);

        // Update the task with the validated data
        $task->update($validated);
        return response()->json(['task'=>$task],200);
    }


    public function destroy(Project $project, Task $task)
    {
        // Check if the task belongs to the specified project
        if ($task->project_id !== $project->id) {
            return response()->json(['message' => 'Task not found in this project.'], 404);
        }

        // Delete the task
        $task->delete();

        // Return a success message
        return response()->json(['message' => 'Task deleted successfully.'], 200);
    }
}
