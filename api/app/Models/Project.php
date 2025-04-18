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
    public function contributors(){
        return $this->belongsToMany(User::class,'contributions')
        ->withPivot('id','role_id')
        ->wherePivot('role_id','!=',1);
    }
    public function categories(){
        return $this->hasMany(Category::class);
    }
    public function roles(){
        return $this->hasMany(Role::class);
    }
    public function admin(){
        return $this->belongsToMany(User::class,'contributions')
        ->withPivot('role_id')
        ->wherePivot('role_id',1);
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

}
