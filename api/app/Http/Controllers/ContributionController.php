<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Project;
use Illuminate\Http\Request;

class ContributionController extends Controller
{

    public function index(Project $project)
    {
        $contributors = $project->contributors()->orderBy('created_at')->get();

        $contributors->each(function ($contributor) use ($project) {
            $contributor->status = $contributor->tokens()->exists();
            $contributor->setRelation('role', $contributor->role($project->id)->first());
        });
        return response()->json($contributors);
    }

    public function store(Request $request, Project $project)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);
        $data['project_id'] = $project->id;
        $contribution = Contribution::create($data);
        return response()->json($contribution);
    }


    public function show(Project $project, Contribution $contribution)
    {
        return response()->json($contribution);
    }




    public function update(Request $request, Project $project)
    {
        $this->authorize('manageTeam',$project);
        $data = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'user_id' => 'required|exists:users,id',
        ]);
        $project->contributors()->updateExistingPivot($request->user_id, [
            'role_id' => $request->role_id,
        ]);

        return response()->json("Contribution updated successfully");
    }

    public function destroy(Project $project,Request $request)
    {
        $this->authorize('manageTeam', $project);
        $project->contributors()->detach($request->user_id);
        return response()->json("Contribution deleted successfully");
    }
}
