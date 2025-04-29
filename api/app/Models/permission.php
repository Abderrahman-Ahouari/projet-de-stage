<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class permission extends Model
{
    protected $fillable = [
        'name',
    ];
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'roles_permissions');
    }
}
