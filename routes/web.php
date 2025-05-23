<?php

use App\Http\Controllers\VipZalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/api/search', [VipZalController::class, 'search']);
Route::get('/api/services', [VipZalController::class, 'services']);
Route::get('/api/service', [VipZalController::class, 'service']);
Route::get('/api/airports', [VipZalController::class, 'airports']);
Route::post('/api/payment', [VipZalController::class, 'payment']);

Route::view('/{path}', 'welcome', [])
    ->where('path', '.*');
