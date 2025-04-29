<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\Role;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;

class InviteContributor extends Notification implements ShouldQueue
{
    use Queueable;

    protected $project;
    protected $role;

    public function __construct(Project $project, Role $role)
    {
        $this->project = $project;
        $this->role = $role;
    }

    public function via($notifiable)
    {
        return ['database']; // you can also add 'mail' if needed
    }

    public function toDatabase($notifiable)
    {
        return [
            'project_id' => $this->project->id,
            'project_title' => $this->project->title,
            'role_id' => $this->role->id,
            'role_name' => $this->role->name,
            'is_accepted' => false,
            'is_rejected' => false,
            'message' => 'You have been invited to join the project ' . $this->project->name . ' as ' . ". {$this->role->name} . " . '.'
        ];
    }
}
