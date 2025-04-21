<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'avatar',
        'google_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'password' => 'hashed',
        ];
    }
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'contributions');
    }
    public function ownProjects()
    {
        return $this->belongsToMany(Project::class, 'contributions')
            ->wherePivot('role_id', 1);
    }
    public function sharedProjects()
    {
        return $this->belongsToMany(Project::class, 'contributions')
            ->withPivot('role_id')
            ->wherePivot('role_id','!=', 1);
    }

    public function tasks($projectId){
        return $this->belongsToMany(Task::class,'assignments')
              ->withPivot('project_id')
              ->wherePivot('project_id',$projectId);
    }
    public function role($projectId){
        return $this->belongsToMany(Role::class,'contributions')
              ->withPivot('project_id')
              ->wherePivot('project_id',$projectId);
    }



    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (!$user->avatar) {
                $encodedName = urlencode($user->username);
                $user->avatar = "https://ui-avatars.com/api/?name={$encodedName}&size=128&background=random&color=fff";
            }
        });
    }
}
