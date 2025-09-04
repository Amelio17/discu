<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des utilisateurs de test
        $users = [
            [
                'name' => 'Alice Martin',
                'email' => 'alice@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Bob Dupont',
                'email' => 'bob@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Claire Dubois',
                'email' => 'claire@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'David Leroy',
                'email' => 'david@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Emma Rousseau',
                'email' => 'emma@example.com',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
