<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Discussion;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:1',
            'discussion_id' => 'required|exists:discussions,id',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'content' => $request->content,
            'discussion_id' => $request->discussion_id,
            'parent_id' => $request->parent_id,
            'user_id' => $request->user()->id,
        ]);

        $comment->load('user');

        return response()->json([
            'status' => 'success',
            'message' => 'Commentaire ajouté avec succès',
            'comment' => $comment,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Vérifier que l'utilisateur est l'auteur
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous n\'êtes pas autorisé à modifier ce commentaire',
            ], 403);
        }

        $request->validate([
            'content' => 'required|string|min:1',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Commentaire mis à jour avec succès',
            'comment' => $comment,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Vérifier que l'utilisateur est l'auteur
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous n\'êtes pas autorisé à supprimer ce commentaire',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Commentaire supprimé avec succès',
        ]);
    }

    public function markAsSolution(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        $discussion = Discussion::findOrFail($comment->discussion_id);

        // Vérifier que l'utilisateur est l'auteur de la discussion
        if ($discussion->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous n\'êtes pas autorisé à marquer cette solution',
            ], 403);
        }

        // Désactiver les autres solutions de cette discussion
        Comment::where('discussion_id', $discussion->id)
            ->where('is_solution', true)
            ->update(['is_solution' => false]);

        // Marquer ce commentaire comme solution
        $comment->update(['is_solution' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Commentaire marqué comme solution',
            'comment' => $comment,
        ]);
    }
}
