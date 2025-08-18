<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $name = $request->input('name');

        $users = User::with('shippingAddresses')->where('name', 'LIKE', "%{$name}%")->get();

        if (count($users) < 1) {
            return 'No users found.';
        }

        return $users->load('shippingAddresses');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role' => 'required'
        ]);

        $user = User::create($fields);

        $user->createToken($user->name);

        return [
            'message' => 'User created successfully',
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return [
            'user' => $user
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'required|min:8',
            'role' => 'required'
        ]);

        $user->update($fields);

        return [
            'user' => $user,
            'message' => 'User updated successfully'
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {

        if (!$user) {
            return 'User not found.';
        }

        $message = $user->name . ' deleted successfully.';

        $user->tokens()->delete();

        $user->delete();

        return [
            'message' => $message
        ];
    }
}
