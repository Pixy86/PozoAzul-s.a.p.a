<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreFlockRequest;
use App\Models\Flock;
use Illuminate\Http\JsonResponse;

class FlockController extends Controller
{
    /**
     * Store a newly created flock.
     */
    public function store(StoreFlockRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // El current_birds inicial es igual al initial_birds
        $data['current_birds'] = $data['initial_birds'];
        $data['status'] = $data['status'] ?? 'ACTIVE';

        $flock = Flock::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $flock,
            'message' => 'Lote de aves creado exitosamente.',
        ], 201);
    }

    /**
     * Display a listing of active flocks.
     */
    public function index(): JsonResponse
    {
        $flocks = Flock::where('status', 'ACTIVE')->with('shed')->get();
        return response()->json([
            'status' => 'success',
            'data' => $flocks,
        ]);
    }
}
