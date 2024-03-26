<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class VipZalController extends Controller
{
    function apiError($msg)
    {
        $result = array(
            "status" => false,
            "message" => $msg
        );
        return json_encode($result);
    }

    public function search(Request $request)
    {
        $term = $request->input('term');
        $response = Http::withToken(env('VIP_ZAL_API_KEY', ''))
        ->acceptJson()
        ->get(env('VIP_ZAL_BASE_URL', '') . '/v1/query/cities', [
            'term' => $term,
            'limit' => 10,
            'lang' => 'ru'
        ]);
        if ($response->ok()) {
            $response = $response->json();
            $result = array(
                "status" => true,
                "result" => $response
            );
            return json_encode($result);
        } else {
            return $this->apiError($response->json());
        }
    }

    public function createOrder()
    {
        $fields = DB::table('orders')
            ->select('id', 'cdek')
            ->where('status', '=', 'created')
            ->get();
        if ($fields) {
            $response = Http::asForm()->post('https://api.cdek.ru/v2/oauth/token', [
                'grant_type' => 'client_credentials',
                'client_id' => env('CDEK_CLIENT_ID', ''),
                'client_secret' => env('CDEK_CLIENT_SECRET', '')
            ]);
            if ($response->ok()) {
                $token = $response->json()['access_token'];
                foreach ($fields as $key => $value) {
                    $resp = Http::withToken($token)->post('https://api.cdek.ru/v2/orders', json_decode($value->cdek, true));
                    if ($resp->json()['requests'][0]['state'] != "INVALID") {
                        $affected = DB::table('orders')
                            ->where('id', $value->id)
                            ->update(['status' => 'processing', 'cdek->uuid' => $resp->json()['entity']['uuid']]);
                        $result = array(
                            "status" => true
                        );
                        return json_encode($result);
                    } else {
                        return $this->apiError($resp->json()['requests'][0]['errors'][0]['message']);
                    }
                }
            } else {
                return $this->apiError('Ошибка авторизации!');
            }
        } else {
            return $this->apiError('Нет данных!');
        }
    }
}
