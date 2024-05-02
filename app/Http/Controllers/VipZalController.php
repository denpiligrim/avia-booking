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
      // $airportsDB = DB::table('airports')
      //   ->where('name', 'LIKE', '%' . $term . '%')
      //   ->orWhere('iata', 'LIKE', '%' . $term . '%')
      //   ->get()
      //   ->toArray();
      //   dd($response);
      //   dd($airportsDB);
      // $combinedAirports = array_merge($response, $airportsDB);

      // // Remove elements where the "iata" values are equal
      // $filteredAirports = [];
      // $iataList = [];
      // foreach ($combinedAirports as $airport) {
      //   if (!in_array($airport["iata"], $iataList)) {
      //     $iataList[] = $airport["iata"];
      //     $filteredAirports[] = $airport;
      //   }
      // }
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

  public function airports()
  {
    // $countries = Http::acceptJson()
    // ->get('http://api.travelpayouts.com/data/ru/countries.json');
    // $cities = Http::acceptJson()
    // ->get('http://api.travelpayouts.com/data/ru/cities.json');
    $response = Http::acceptJson()
      ->get('http://api.travelpayouts.com/data/ru/airports.json');
    if ($response->ok()) {
      $response = $response->json();
      $response = array_filter($response, function ($element) {
        return $element["iata_type"] === "airport";
      });
      print_r(count($response));
      // $resCountries = $countries->json();
      // $resCities = $cities->json();
      $result = array(
        "status" => true,
        "result" => $response
      );
      // foreach ($response as $object) {
      //     $country = "";
      //     foreach ($resCountries as $objCountry) {
      //         if ($object['country_code'] === $objCountry['code']) {
      //             $country = $objCountry['name'] ? $objCountry['name'] : '';
      //             break;
      //         }
      //     }
      //     $city = "";
      //     foreach ($resCities as $objCity) {
      //         if ($object['city_code'] === $objCity['code']) {
      //             $city = $objCity['name'] ? $objCity['name'] : '';
      //             break;
      //         }
      //     }
      //     $label = ($country && $city) ? $country . ', ' . $city : $country . $city;;
      //     DB::table('airports')->insert([
      //         'countryCode' => $object['country_code'],
      //         'iata' => $object['code'],
      //         'label' => $label,
      //         'name' => $object['name'] ? $object['name'] : ''
      //     ]);
      // }
      return json_encode($result);
    } else {
      return $this->apiError($response->json());
    }
  }
}
