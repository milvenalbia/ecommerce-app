<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        $userFields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed'
        ]);

        $user = User::create($userFields);

        auth('web')->login($user);

        return [
            'message' => 'Account registered successfully.',
            'user' => $user,
        ];
    }

    // public function login(Request $request)
    // {

    //     $userFields = $request->validate([
    //         'email' => 'required|email|exists:users',
    //         'password' => 'required'
    //     ]);

    //     $user = User::where('email', $request->email)->first();

    //     if (!$user || !Hash::check($request->password, $user->password)) {
    //         return response()->json([
    //             'errors' => [
    //                 'email' => ["Invalid credentials."]
    //             ]
    //         ], 422); // Unauthorized
    //     }

    //     $request->session()->regenerate();

    //     return [
    //         'message' => 'Login successfully.',
    //         'user' => $user,
    //     ];
    // }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful',
            'user' => Auth::user()
        ]);
    }

    public function logout(Request $request)
    {

        Auth::guard('web')->logout();

        // Invalidate the session
        $request->session()->invalidate();

        // Regenerate the CSRF token
        $request->session()->regenerateToken();

        // For SPA authentication, return a JSON response.
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Logged out successfully']);
        }
    }
}
