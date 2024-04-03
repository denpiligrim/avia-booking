<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class VipZalController extends Controller
{

    private $base_url;
    private $token;

    public function __construct()
    {
        $this->base_url = env('VIP_ZAL_BASE_URL', '');
        $this->token = env('VIP_ZAL_API_KEY', '');
    }

    private function apiError($msg)
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
        $response = Http::withToken($this->token)
        ->acceptJson()
        ->get($this->base_url . '/query/cities', [
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

    public function services(Request $request)
    {
        $iata = $request->input('iata');
        $direction = $request->input('direction');
        $response = Http::withToken($this->token)
        ->acceptJson()
        ->get($this->base_url . '/query/services', [
            'iata' => $iata,
            'type' => $direction
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
    
    public function service(Request $request)
    {
        $id = $request->input('id');
        $response = Http::withToken($this->token)
        ->acceptJson()
        ->get($this->base_url . '/query/service/' . $id);
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
}
