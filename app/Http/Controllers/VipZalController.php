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
      $airportsDB = DB::table('airports')
        ->where('name', 'LIKE', '%' . $term . '%')
        ->orWhere('iata', 'LIKE', '%' . $term . '%')
        ->get()
        ->toArray();
      $airportsDB = json_decode(json_encode($airportsDB), true);
      $combinedAirports = array_merge($airportsDB, $response);

      $filteredAirports = [];
      $iataList = [];
      foreach ($combinedAirports as $airport) {
        if (!in_array($airport["iata"], $iataList)) {
          $iataList[] = $airport["iata"];
          $filteredAirports[] = $airport;
        }
      }
      //   usort($filteredAirports, function ($a, $b) {
      //     global $term;

      //     $posA = stripos(strtolower($a["name"]), strtolower($term));
      //     $posB = stripos(strtolower($b["name"]), strtolower($term));

      //     if ($posA !== false && $posB !== false) {
      //         return $posA - $posB;
      //     } elseif ($posA !== false) {
      //         return -1;
      //     } elseif ($posB !== false) {
      //         return 1;
      //     } else {
      //         return 0;
      //     }
      // });
      $result = array(
        "status" => true,
        "result" => $filteredAirports
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

  public function payment(Request $request)
  {
    $sum = (float) $request->input('sum');
    $firstName = $request->input('firstName');
    $label = $request->input('label');
    $email = $request->input('email');
    $phone = $request->input('phone');

    $user = env('PAYKEEPER_LOGIN', '');
    $password = env('PAYKEEPER_PASSWORD', '');
    $base64 = base64_encode("$user:$password");
    $server_paykeeper = env('PAYKEEPER_SERVER', '');

    $all = [
      'name' => $firstName,
      'phone' => $phone,
      'email' => $email,
      'order_data' => json_encode($request->all())
  ];

    $dbInsert = DB::table('orders_leadaero')->insert($all);

    $mc = new MailController();
    $mc->index($all);

    $payment_data = array(
      "pay_amount" => $sum,
      // "pay_amount" => 1.00,
      "clientid" => $firstName,
      // "orderid" => "Заказ № 10",
      "service_name" => $label,
      "client_email" => $email,
      "client_phone" => $phone
    );

    // $response = Http::withToken($base64, 'Basic')
    //   ->asForm()
    //   ->acceptJson()
    //   ->get($server_paykeeper . '/info/settings/token/');
    // if ($response->ok()) {
    //   $response = $response->json();
    //   $token = $response['token'];
    //   $payment_data['token'] = $token;
    //   $response = Http::withToken($base64, 'Basic')
    //   ->asForm()
    //   ->acceptJson()
    //   ->post($server_paykeeper . '/change/invoice/preview/', $payment_data);
    //   if ($response->ok()) {
    //     $response = $response->json();
    //     $invoice_id = $response['invoice_id'];
    //     $link = "$server_paykeeper/bill/$invoice_id/";
    //     $result = array(
    //       "status" => true,
    //       "result" => $link
    //     );
    //     return json_encode($result);
    //   } else {
    //   return $this->apiError($response->json());
    //   }    
    // } else {
    //   return $this->apiError($response->json());
    // }
  }

  // public function airports()
  // {
  //   $countries = Http::acceptJson()
  //   ->get('http://api.travelpayouts.com/data/ru/countries.json');
  //   $cities = Http::acceptJson()
  //   ->get('http://api.travelpayouts.com/data/ru/cities.json');
  //   $response = Http::acceptJson()
  //     ->get('http://api.travelpayouts.com/data/ru/airports.json');
  //   if ($response->ok()) {
  //     $response = $response->json();
  //     $response = array_filter($response, function ($element) {
  //       return $element["iata_type"] === "airport";
  //     });
  //     $resCountries = $countries->json();
  //     $resCities = $cities->json();
  //     $result = array(
  //       "status" => true,
  //       "result" => $response
  //     );
  //     foreach ($response as $object) {
  //         $country = "";
  //         foreach ($resCountries as $objCountry) {
  //             if ($object['country_code'] === $objCountry['code']) {
  //                 $country = $objCountry['name'] ? $objCountry['name'] : '';
  //                 break;
  //             }
  //         }
  //         $city = "";
  //         foreach ($resCities as $objCity) {
  //             if ($object['city_code'] === $objCity['code']) {
  //                 $city = $objCity['name'] ? $objCity['name'] : '';
  //                 break;
  //             }
  //         }
  //         $label = ($country && $city) ? $country . ', ' . $city : $country . $city;
  //         DB::table('airports')->insert([
  //             'countryCode' => $object['country_code'],
  //             'iata' => $object['code'],
  //             'label' => $label,
  //             'name' => $object['name'] ? $object['name'] : $city
  //         ]);
  //     }
  //     return json_encode($result);
  //   } else {
  //     return $this->apiError($response->json());
  //   }
  // }
}
