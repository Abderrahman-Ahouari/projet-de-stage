<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory,HasApiTokens;
    protected $fillable = [
        'name'
    ];
    public function project() {
        return $this->belongsTo(Project::class);
    }


    protected $casts = ['id'=>'string'];
    public function tasks() {
        return $this->hasMany(Task::class);
    }
}
