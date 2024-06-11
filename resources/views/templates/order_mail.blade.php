<!DOCTYPE html>
<html>
<head>
    <title>Спасибо за заказ!</title>
</head>
<body>
  <div style="width: 100; text-align: center; background-color: #0b203a; padding: 4px;"><img src="https://drive.google.com/uc?export=view&id=1UClMop6DCLcrujOHsX75SZ8on6dmsWAH" alt="Header image" style="width: 100%; max-width: 300px;"></div>
    
    <div style="text-align: center; padding: 5px 1px;">
        <h1 style="text-align: center;">🔔<b> Спасибо за заказ! </b>🔔</h1>
    </div>
    <br>
    @php
    $data = json_decode($data['body']['order_data'], true);
    @endphp
    <p><i><b>Сведения о бронировании</b></i></p>
    <p><b>Номер рейса:</b> {{ $data['flight']['flightNumber'] }}</p>
    <p><b>{{ $data['label'] }}</p>
      <br>
    <p><b>Сумма заказа:</b> {{ number_format($data['sum'], 0, '', ' ') . ' ₽' }}</p>
    <br>
    <p><i><b>Контактные данные</b></i></p>
    <p><b>Имя:</b> {{ $data['firstName'] }}</p>
    <p><b>Телефон:</b> {{ $data['phone'] }}</p>
    <p><b>Email:</b> {{ $data['email'] }}</p>
</body>
</html>