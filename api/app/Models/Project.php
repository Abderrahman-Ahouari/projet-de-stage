<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory,HasApiTokens,HasUuids;

    public function tasks(){
        return $this->hasMany(Task::class);
    }
    public function contributors()
    {
        // Get role IDs that are not "admin" for this project
        $adminRoleId = $this->roles()->where('name', 'admin')->value('id');

        return $this->belongsToMany(User::class, 'contributions')
            ->withPivot('role_id')
            ->wherePivot('role_id', '!=', $adminRoleId);
    }

    public function admin()
    {
        // Get the ID of the admin role for this project
        $adminRoleId = $this->roles()->where('name', 'admin')->value('id');

        return $this->belongsToMany(User::class, 'contributions')
            ->withPivot('role_id')
            ->wherePivot('role_id', $adminRoleId);
    }
    public function categories(){
        return $this->hasMany(Category::class);
    }
    public function roles(){
        return $this->hasMany(Role::class);
    }
    protected $fillable = [
        'title',
        'description',
        'deadline'
    ];
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'password' => 'hashed',
        ];
    }
    protected static function booted()
    {
        static::created(function ($project) {
            $defaultRoles = ['admin', 'read', 'write'];

            // Fetch all permissions once to avoid multiple queries
            $permissions = permission::all()->keyBy('name');

            foreach ($defaultRoles as $roleName) {
                $role = $project->roles()->create([
                    'name' => $roleName,
                ]);

                if ($roleName === 'admin') {
                    // Assign all permissions to admin
                    $role->permissions()->sync($permissions->pluck('id'));
                }

                if ($roleName === 'read') {
                    // Assign only read permissions
                    $role->permissions()->sync([
                        $permissions['consult project']->id,
                        $permissions['consult progress']->id,
                        $permissions['consult team']->id,
                    ]);
                }

                if ($roleName === 'write') {
                    // All except: delete project, manage team, manage roles
                    $writePermissions = $permissions->except([
                        'delete project',
                        'manage team',
                        'manage roles',
                    ]);
                    $role->permissions()->sync($writePermissions->pluck('id'));
                }
            }
        });
        static::created(function ($project) {
            $defaultCategories = ['basic', 'feature', 'bug'];

            foreach ($defaultCategories as $category) {
                $project->categories()->create([
                    'name' => $category,
                ]);
            }
        });
    }

}
