<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    public function consultProject(User $user, $project){
        return $user->hasPermission('consult project', $project->id);
    }
    public function consultProgress(User $user, $project){
        return $user->hasPermission('consult progress', $project->id);
    }
    public function consultTeam(User $user, $project){
        return $user->hasPermission('consult team', $project->id);
    }
    public function addTask(User $user, $project){
        return $user->hasPermission('add task', $project->id);
    }
    public function updateTaskStatus(User $user, $project){
        return $user->hasPermission('update task status', $project->id);
    }
    public function deleteTask(User $user, $project){
        return $user->hasPermission('delete task', $project->id);
    }
    public function categorizeTask(User $user, $project){
        return $user->hasPermission('categorize task', $project->id);
    }
    public function addCategory(User $user, $project){
        return $user->hasPermission('add category', $project->id);
    }
    public function deleteProject(User $user, $project){
        return $user->hasPermission('delete project', $project->id);
    }
    public function manageTeam(User $user, $project){
        return $user->hasPermission('manage team', $project->id);
    }
    public function manageRoles(User $user, $project){
        return $user->hasPermission('manage roles', $project->id);
    }
    public function assignTask(User $user, $project){
        return $user->hasPermission('assign task', $project->id);
    }
}
