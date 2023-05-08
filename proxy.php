<?php
$url = "https://api-mainnet.magiceden.dev/v2/wallets/4rx9gvDhpgoFSTc63qTzu9vV7YUm6W4XZ6QzJF3wEZCj/tokens?offset=0&limit=500&listStatus=both";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
http_response_code($http_code);
echo $response;
?>