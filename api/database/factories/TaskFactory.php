<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence, // Random title
            'description' => $this->faker->paragraph, // Random description
            'project_id' => Project::factory(), // Assuming you have a Project model factory
            'status' => $this->faker->randomElement(['todo', 'doing', 'review', 'done']), // Random status
            'category_id' => Category::factory(),
        ];
    }
}
