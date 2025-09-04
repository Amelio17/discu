<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'conversation_id' => 'required|exists:conversations,id',
        ]);

        $user = auth()->user();
        
        // Vérifier que l'utilisateur fait partie de la conversation
        $conversation = Conversation::where('id', $request->conversation_id)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->firstOrFail();

        $message = Message::create([
            'content' => $request->content,
            'user_id' => $user->id,
            'conversation_id' => $request->conversation_id,
            'type' => 'text',
        ]);

        $message->load('user');

        // Mettre à jour la conversation
        $conversation->touch();

        return response()->json([
            'status' => 'success',
            'message' => $message,
        ], 201);
    }

    public function index($conversationId)
    {
        $user = auth()->user();

        // Vérifier que l'utilisateur fait partie de la conversation
        $conversation = Conversation::where('id', $conversationId)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->firstOrFail();

        $messages = $conversation->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'messages' => $messages,
        ]);
    }

    public function markAsRead($conversationId)
    {
        $user = auth()->user();

        // Vérifier que l'utilisateur fait partie de la conversation
        $conversation = Conversation::where('id', $conversationId)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->firstOrFail();

        $conversation->markAsRead($user->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Messages marqués comme lus',
        ]);
    }
}
