<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    public function index()
    {
        $discussions = Discussion::with(['user', 'lastComment'])
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'discussions' => $discussions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|string|in:general,tech,help,offtopic',
        ]);

        $discussion = Discussion::create([
            'title' => $request->title,
            'content' => $request->content,
            'category' => $request->category,
            'user_id' => $request->user()->id,
        ]);

        $discussion->load('user');

        return response()->json([
            'status' => 'success',
            'message' => 'Discussion créée avec succès',
            'discussion' => $discussion,
        ], 201);
    }

    public function show($id)
    {
        $discussion = Discussion::with(['user', 'comments.user'])
            ->findOrFail($id);

        $discussion->incrementViews();

        return response()->json([
            'status' => 'success',
            'discussion' => $discussion,
        ]);
    }

    public function update(Request $request, $id)
    {
        $discussion = Discussion::findOrFail($id);

        // Vérifier que l'utilisateur est l'auteur
        if ($discussion->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous n\'êtes pas autorisé à modifier cette discussion',
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|string|in:general,tech,help,offtopic',
        ]);

        $discussion->update([
            'title' => $request->title,
            'content' => $request->content,
            'category' => $request->category,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Discussion mise à jour avec succès',
            'discussion' => $discussion,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $discussion = Discussion::findOrFail($id);

        // Vérifier que l'utilisateur est l'auteur
        if ($discussion->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous n\'êtes pas autorisé à supprimer cette discussion',
            ], 403);
        }

        $discussion->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Discussion supprimée avec succès',
        ]);
    }
}
