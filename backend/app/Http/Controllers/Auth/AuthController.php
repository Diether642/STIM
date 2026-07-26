<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => 'required|in:tourist,business_owner',
            'phone' => 'nullable|string|max:20',
        ]);

        $role = Role::where('name', $validated['role'])->firstOrFail();

        $user = User::create([
            'role_id' => $role->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'status' => $validated['role'] === 'business_owner' ? 'pending' : 'active',
        ]);

        // If business owner, don't return a token (they can't log in yet)
        if ($validated['role'] === 'business_owner') {
            return response()->json([
                'message' => 'Registration submitted. Your account is pending admin approval.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $role->name,
                    'status' => 'pending',
                ],
            ], 201);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role->name,
            ],
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $user = Auth::user();

        if ($user->status === 'suspended') {
            Auth::logout();
            return response()->json(['message' => 'Account suspended. Contact administrator.'], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name,
                'phone' => $user->phone,
            ],
            'token' => $token,
        ]);

        if ($user->isBusinessOwner() && $user->status === 'pending') {
            Auth::logout();
            return response()->json([
                'message' => 'Your account is pending approval. You will be notified once the Tourism Office reviews your application.'
            ], 403);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user()->load('role');
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->name,
            'phone' => $user->phone,
            'avatar' => $user->avatar,
            'created_at' => $user->created_at,
        ]);
    }
}