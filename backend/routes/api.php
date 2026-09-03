<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| SAPA - Sistema Administrativo Pozo Azul
| Todas las rutas API se registran aquí. No usar closures.
| Cada ruta debe apuntar a un método de controlador.
|
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'SAPA API funcionando correctamente.',
    ]);
});

Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/me', [App\Http\Controllers\AuthController::class, 'me']);
    Route::put('/user', [App\Http\Controllers\AuthController::class, 'updateProfile']);
});

Route::get('/flocks', [App\Http\Controllers\FlockController::class, 'index']);
Route::post('/flocks', [App\Http\Controllers\FlockController::class, 'store']);
Route::get('/feed-inventories', [App\Http\Controllers\FeedInventoryController::class, 'index']);
Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index']);
Route::post('/daily-reports', [App\Http\Controllers\DailyReportController::class, 'store']);

