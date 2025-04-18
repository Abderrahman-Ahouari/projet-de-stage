<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index(Project $project)
    {
        return response()->json($project->categories);
    }


    public function store(Request $request , Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $category = $project->categories()->create($request->all());
        return response()->json($category, 201);
    }


    public function update(Request $request, Category $category, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $category->update($request->all());
        return response()->json($category);
    }

    public function destroy(Category $category,Project $project)
    {
        $project->categories()->delete();
        return response()->json(null, 204);
    }
}
