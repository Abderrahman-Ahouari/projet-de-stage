<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    public function project(){
        return $this->belongsTo(Project::class);
    }
    protected $fillable = [
        'name',
        'project_id'
    ];
}
