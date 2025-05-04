<?php


namespace App\Http\Controllers;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use App\Notifications\InviteContributor;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;


class ProjectController extends Controller
{
    public function admin(Project $project)
    {
        $admin = $project->admin;
        return response()->json($admin);
    }


    // public function index()
    // {
    //     $projects = Project::with('contributors')->orderBy('created_at', 'desc')->get();
    //     if ($projects->isEmpty()) {
    //         return response()->json([
    //             'message' => 'No projects found'
    //         ], 404);
    //     }
    //     $projects->load('roles');
    //     $projects->load('categories');
    //     return response()->json($projects);
    // }



    public function show(Request $request,Project $project)
    {
        $this->authorize('consultProject', $project);
        $project->load(['contributors', 'tasks', 'categories.tasks', 'roles']);
        foreach ($project->contributors as $contributor) {
            $contributor->setRelation('tasks', $contributor->tasks($project->id)->get());
        }
        return response()->json($project);
    }



    public function userProjects(Request $request)
    {
        $projects = $request->user()->ownProjects()->orderBy('created_at', 'desc')->get();
        foreach ($projects as $project) {
            $project->contributors = $project->contributors()->get();
            $project->tasks = $project->tasks($project->id)->get();
        }

        return response()->json($projects);
    }
    public function sharedProjects(Request $request)
    {
        $projects = $request->user()->sharedProjects()->orderBy('created_at', 'desc')->get();
        foreach ($projects as $project) {
            $project->contributors = $project->contributors()->get();
            $project->tasks = $project->tasks($project->id)->get();
        }
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:20',
            'description' => 'string|max:255|nullable',
            'deadline' => 'required|date|after_or_equal:today'
        ]);
        $project = Project::create($data);
        if ($project){
            $adminRole = $project->roles()->where('name', 'admin')->first();

            $request->user()->ownProjects()->attach($project, ['role_id' => $adminRole->id]);
        }
        return response()->json(['project' => $project], 201);
    }



    public function update(Request $request, Project $project)
    {
        $this->authorize('deleteProject', $project);
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($validated);

        return response()->json(['message' => 'Project updated successfully', 'project' => $project], 200);
    }

    public function destroy(Project $project)
    {
        $this->authorize('deleteProject', $project);
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
    public function invite(Request $request, Project $project)
    {
        $this->authorize('manageTeam', $project);
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();
        $role = Role::findOrFail($request->role_id);

        // Send the invite notification
        $user->notify(new InviteContributor($project, $role));

        return response()->json(['message' => 'Invitation sent successfully']);
    }
    public function acceptInvite(DatabaseNotification $notification)
    {
        if ($notification->notifiable_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
        if ($notification->data['is_accepted'] || $notification->data['is_rejected']) {
            abort(400, 'Invitation already accepted or rejected');
        }

        $data = $notification->data;
        $projectId = $data['project_id'];
        $roleId = $data['role_id'];

        // Attach user to the project
        $project = Project::findOrFail($projectId);
        $project->contributors()->syncWithoutDetaching([
            auth()->id() => ['role_id' => $roleId]
        ]);

        // Update notification data
        $data['is_accepted'] = true;
        $data['is_rejected'] = false;
        $notification->data = $data;
        $notification->markAsRead();
        $notification->save();

        return response()->json(['message' => 'You have joined the project']);
    }

    public function rejectInvite(DatabaseNotification $notification)
    {
        if ($notification->notifiable_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
        if ($notification->data['is_accepted'] || $notification->data['is_rejected']) {
            abort(400, 'Invitation already accepted or rejected');
        }

        // Update notification data
        $data = $notification->data;
        $data['is_accepted'] = false;
        $data['is_rejected'] = true;
        $notification->data = $data;
        $notification->markAsRead();
        $notification->save();

        return response()->json(['message' => 'You have rejected the invitation']);
    }
    public function markAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }

}
