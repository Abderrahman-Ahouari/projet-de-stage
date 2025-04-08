<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory,HasApiTokens,HasUuids;

    protected $fillable = [
        'title',
        'description',
        'category_id',
        'status'
    ];
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'password' => 'hashed',
        ];
    }
    public function project(){
        return $this->belongsTo(Project::class);
    }
    public function category(){
        return $this->belongsTo(Category::class);
    }


}
