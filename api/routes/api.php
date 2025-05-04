<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
use App\Models\Contribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::name('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout',[AuthController::class,'logout'])->name('auth.logout');
    Route::apiResource('projects', ProjectController::class);
    Route::get('/user/projects', [ProjectController::class, 'userProjects']);
    Route::get('/user/shared', [ProjectController::class, 'sharedProjects']);
    Route::apiResource('projects.contributions', ContributionController::class);
    Route::put('projects/{project}/contributions', [ContributionController::class,'update']);
    Route::delete('projects/{project}/contributions', [ContributionController::class,'destroy']);
    Route::get('/projects/{project}/admin', [ProjectController::class, 'admin']);
    Route::apiResource('projects.tasks', TaskController::class);
    Route::apiResource('projects.categories',CategoryController::class);
    Route::apiResource('projects.roles',RoleController::class);
    Route::post('projects/{project}/tasks/{task}/assign', [TaskController::class,'assign']);
    Route::delete('projects/{project}/tasks/{task}/unassign', [TaskController::class,'unassign']);
    Route::post('/projects/{project}/invite', [ProjectController::class, 'invite']);
    Route::get('/notifications', function (Request $request) {
        return response()->json(request()->user()->notifications);
    });
    Route::post('/notifications/markAsRead', [ProjectController::class, 'markAsRead']);
    Route::post('/notifications/{notification}/accept', [ProjectController::class, 'acceptInvite']);
    Route::post('/notifications/{notification}/reject', [ProjectController::class, 'rejectInvite']);

    Route::get('/projects/{project}/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions', [PermissionController::class, 'allPermissions']);
    Route::post('/projects/{project}/roles/{role}/permissions', [RoleController::class, 'grant']);
    Route::delete('/projects/{project}/roles/{role}/permissions', [RoleController::class, 'remove']);

});

Route::get('auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
