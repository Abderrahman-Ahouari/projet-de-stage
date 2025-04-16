<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Project;
use Illuminate\Http\Request;

class ContributionController extends Controller
{

    public function index(Project $project)
    {
        return response()->json($project->contributors);
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


    public function show(Project $project,Contribution $contribution)
    {
        return response()->json($contribution);
    }




    public function update(Request $request,Project $project, Contribution $contribution)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);
        $contribution->update($request->all());
        return response()->json("Contribution updated successfully");
    }

    public function destroy(Project $project ,Contribution $contribution)
    {
        $contribution->delete();
        return response()->json("Contribution deleted successfully");
    }
}
