<!DOCTYPE html>
<html>
<head>
    <title>Спасибо за заказ!</title>
</head>
<body>
    <div style="width: 100; text-align: center; background-color: #0b203a;"><img src="https://static.tildacdn.com/tild3033-3035-4262-a131-356239373363/lead_logo_main_white.svg" alt="Header image" style="width: 100%; max-width: 100vw; border-radius: 12px;"></div>
    
    <div style="text-align: center; padding: 5px 1px;">
        <h1 style="text-align: center;"><b> Ваучер </b></h1>
    </div>
    <br>
    @php
    $data = json_decode(json_encode($data['body']), true);
    @endphp
    <div style="padding: 4px;">
      <h6 style="margin-bottom: 2px;">Рейс</h6>
      <p>Дата и время {serviceInfo.type === "departure" ? "вылета" : serviceInfo.type === "arrival" ? "прилета" : ""}</p>
      <p variant="body2" component="p">{dayjs(date).format('DD.MM.YYYY') + " " + dayjs(time).format('HH:mm')}</p>
      <p>Номер рейса и направление</p>
      <p variant="body2" component="p">{{$data['flight']}}</p>
      <p variant="body2" component="p">{{departureCity + " — " + arrivalCity}}</p>
    </div>
</body>
</html>