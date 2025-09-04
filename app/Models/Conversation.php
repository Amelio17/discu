<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_group',
    ];

    protected $casts = [
        'is_group' => 'boolean',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'conversation_user')
            ->withPivot('is_admin', 'last_read_at')
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latest();
    }

    public function unreadMessagesCount($userId)
    {
        return $this->messages()
            ->where('user_id', '!=', $userId)
            ->where('created_at', '>', $this->users()->where('user_id', $userId)->first()->pivot->last_read_at ?? '1970-01-01')
            ->count();
    }

    public function markAsRead($userId)
    {
        $this->users()->updateExistingPivot($userId, [
            'last_read_at' => now(),
        ]);
        
        $this->messages()
            ->where('user_id', '!=', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function getOtherUser($currentUserId)
    {
        if ($this->is_group) {
            return null;
        }
        
        return $this->users()->where('user_id', '!=', $currentUserId)->first();
    }

    public function getDisplayName($currentUserId)
    {
        if ($this->is_group) {
            return $this->name;
        }
        
        $otherUser = $this->getOtherUser($currentUserId);
        return $otherUser ? $otherUser->name : 'Conversation';
    }
}
