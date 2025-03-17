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

    protected $fillable = [
        'title',
        'description'
    ];
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'password' => 'hashed',
        ];
    }

}
