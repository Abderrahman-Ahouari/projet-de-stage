<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles_permissions', function (Blueprint $table) {
            $table->string('role_id')->constrained('roles');
            $table->foreignId('permission_id')->constrained('permissions');

        });

    }
    public function down(): void
    {
        //
    }
};
