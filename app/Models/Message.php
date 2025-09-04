<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'user_id',
        'conversation_id',
        'type',
        'file_path',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function isFromCurrentUser($currentUserId)
    {
        return $this->user_id === $currentUserId;
    }

    public function formatTime()
    {
        return $this->created_at->format('H:i');
    }

    public function formatDate()
    {
        $now = now();
        $messageDate = $this->created_at;
        
        if ($messageDate->isToday()) {
            return 'Aujourd\'hui';
        } elseif ($messageDate->isYesterday()) {
            return 'Hier';
        } else {
            return $messageDate->format('d/m/Y');
        }
    }
}
