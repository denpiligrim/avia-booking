<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta content="" name="description">
    <meta content="" name="keywords">
    <meta name="referrer" content="no-referrer-when-downgrade">
    <meta name="format-detection" content="telephone=no">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="">
    <meta property="og:url" content="{{ Request::url() }}">
    <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}">
    <meta property="og:title" content="">
    <meta property="og:description" content="">
    <meta property="og:image" content="{{ env('APP_URL', '') . '/storage/images/preview.jpg' }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <title>{{ env('APP_NAME', '') }}</title>

    <!-- Favicon -->
    <link rel="shortcut icon" href="{{ env('APP_URL', '') . '/storage/images/favicon.svg' }}" type="image/x-icon">
    <!-- Canonical -->
    <link rel="canonical" href="{{ Request::url() }}">

    @viteReactRefresh
    @vite('resources/js/app.jsx')
<!-- Yandex.Metrika counter -->

 <!-- /Yandex.Metrika counter -->
</head>

<body>
    <div id="app"></div>
</body>

</html>