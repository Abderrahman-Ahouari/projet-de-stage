<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    public function index(Project $project)
    {
        $tasks = $project->tasks;
        return response()->json($tasks);
    }


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
        if ($task->project_id !== $project->id) {
            return response()->json(['message' => 'Task not found in this project.'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully.'], 200);
    }

    public function assign(Project $project,Task $task,Request $request){
        $data = $request->validate([
            'user_id'=> 'required|exists:users,id'
        ]);


        $user = User::findOrFail($data['user_id']);
        $user->tasks()->attach($task);
        return response()->json(['message' => 'Task assigned successfully.'], 200);
    }
    public function unAssign(Project $project,Task $task,Request $request){
        $data = $request->validate([
            'user_id'=> 'required|exists:users,id'
        ]);
        $user = User::findOrFail($data['user_id']);
        $user->tasks()->detach($task);
        return response()->json(['message' => 'Task unassigned successfully.'], 200);
    }

}
