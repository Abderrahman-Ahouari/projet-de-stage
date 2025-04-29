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
        $this->authorize('consultProject', $project);
        $tasks = $project->tasks()
            ->with(['assignees', 'category'])
            ->orderBy('updated_at', 'asc') // or 'asc' if you want oldest first
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request, Project $project)
    {
        $this->authorize('addTask', $project);
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
        $this->authorize('updateTaskStatus', $project);
        if ($task->project_id !== $project->id) {
            return response()->json(['message' => 'Task not found in this project.'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:todo,doing,review,done',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        if (isset($validated['category_id'])) {
            $task->fill($validated);
            $task->timestamps = false; // this prevents `updated_at` from being touched
            $task->save();
        } else {
            $task->update($validated);
        }

        return response()->json(['task' => $task], 200);
    }


    public function destroy(Project $project, Task $task)
    {
        $this->authorize('deleteTask', $project);
        if ($task->project_id !== $project->id) {
            return response()->json(['message' => 'Task not found in this project.'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully.'], 200);
    }

    public function assign(Project $project,Task $task,Request $request){

        $this->authorize('assignTask', $project);
        $data = $request->validate([
            'user_id'=> 'required|exists:users,id'
        ]);


        $user = User::findOrFail($data['user_id']);
        $already = $user->tasks($project->id)
        ->where('tasks.id', $task->id)
        ->wherePivot('project_id', $project->id)
        ->exists();

    if ($already) {
        return response()->json(['message' => 'User already assigned to that task in this project.'], 422);
    }
        $user->tasks($project->id)->attach($task,[
            'project_id' => $project->id,
        ]);
        return response()->json(['message' => 'Task assigned successfully.'], 200);
    }
    public function unassign(Project $project,Task $task,Request $request){
        $this->authorize('assignTask', $project);
        $data = $request->validate([
            'user_id'=> 'required|exists:users,id'
        ]);
        $user = User::findOrFail($data['user_id']);
        $already = $user->tasks($project->id)
        ->where('tasks.id', $task->id)
        ->wherePivot('project_id', $project->id)
        ->exists();

    if (!$already) {
        return response()->json(['message' => 'User was not assigned to that task in this project.'], 422);
    }
        $user->tasks($project->id)->detach($task);
        return response()->json(['message' => 'Task unassigned successfully.'], 200);
    }

}
