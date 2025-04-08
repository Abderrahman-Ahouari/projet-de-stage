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
    protected $casts = ['id'=>string];
    public function tasks() {
        return $this->hasMany(Task::class);
    }
}
