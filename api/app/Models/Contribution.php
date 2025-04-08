<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    /** @use HasFactory<\Database\Factories\ContributionFactory> */
    use HasFactory,HasUuids;
    protected $fillable = ['user_id', 'project_id', 'role_id'];
}
