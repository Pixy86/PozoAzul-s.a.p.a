<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\FeedInventory;
use Illuminate\Http\JsonResponse;

class FeedInventoryController extends Controller
{
    /**
     * Display a listing of feed inventories with stock.
     */
    public function index(): JsonResponse
    {
        $inventories = FeedInventory::where('sacks_stock', '>', 0)
            ->orderBy('entry_date', 'asc') // FIFO
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $inventories,
        ]);
    }
}
