<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'error' => [
            'code' => 'METHOD_NOT_ALLOWED',
            'message' => 'Only GET requests are allowed'
        ]
    ], JSON_PRETTY_PRINT);
    exit;
}

$cryptos = [
    'BTC' => ['symbol'=>'BTC','name'=>'Bitcoin','price'=>112450.25,'currency'=>'USD','price_change_24h'=>2.45,'market_cap'=>2230000000000,'volume_24h'=>48500000000,'last_updated'=>'2026-09-30T08:00:00Z'],
    'ETH' => ['symbol'=>'ETH','name'=>'Ethereum','price'=>4215.75,'currency'=>'USD','price_change_24h'=>1.82,'market_cap'=>508000000000,'volume_24h'=>21300000000,'last_updated'=>'2026-09-30T08:00:00Z'],
    'SOL' => ['symbol'=>'SOL','name'=>'Solana','price'=>198.42,'currency'=>'USD','price_change_24h'=>-0.75,'market_cap'=>96500000000,'volume_24h'=>5200000000,'last_updated'=>'2026-09-30T08:00:00Z'],
    'BNB' => ['symbol'=>'BNB','name'=>'BNB','price'=>925.15,'currency'=>'USD','price_change_24h'=>3.12,'market_cap'=>137000000000,'volume_24h'=>2400000000,'last_updated'=>'2026-09-30T08:00:00Z'],
    'XRP' => ['symbol'=>'XRP','name'=>'XRP','price'=>2.84,'currency'=>'USD','price_change_24h'=>-1.35,'market_cap'=>168000000000,'volume_24h'=>7100000000,'last_updated'=>'2026-09-30T08:00:00Z']
];

$history = [
    'BTC'=>[['timestamp'=>'2026-09-26T08:00:00Z','price'=>108500.25],['timestamp'=>'2026-09-27T08:00:00Z','price'=>109850.75],['timestamp'=>'2026-09-28T08:00:00Z','price'=>111250.50],['timestamp'=>'2026-09-29T08:00:00Z','price'=>110950.10],['timestamp'=>'2026-09-30T08:00:00Z','price'=>112450.25]],
    'ETH'=>[['timestamp'=>'2026-09-26T08:00:00Z','price'=>4050.25],['timestamp'=>'2026-09-27T08:00:00Z','price'=>4110.50],['timestamp'=>'2026-09-28T08:00:00Z','price'=>4185.75],['timestamp'=>'2026-09-29T08:00:00Z','price'=>4140.20],['timestamp'=>'2026-09-30T08:00:00Z','price'=>4215.75]],
    'SOL'=>[['timestamp'=>'2026-09-26T08:00:00Z','price'=>190.25],['timestamp'=>'2026-09-27T08:00:00Z','price'=>194.80],['timestamp'=>'2026-09-28T08:00:00Z','price'=>201.25],['timestamp'=>'2026-09-29T08:00:00Z','price'=>199.75],['timestamp'=>'2026-09-30T08:00:00Z','price'=>198.42]],
    'BNB'=>[['timestamp'=>'2026-09-26T08:00:00Z','price'=>895.50],['timestamp'=>'2026-09-27T08:00:00Z','price'=>905.25],['timestamp'=>'2026-09-28T08:00:00Z','price'=>918.40],['timestamp'=>'2026-09-29T08:00:00Z','price'=>910.75],['timestamp'=>'2026-09-30T08:00:00Z','price'=>925.15]],
    'XRP'=>[['timestamp'=>'2026-09-26T08:00:00Z','price'=>2.75],['timestamp'=>'2026-09-27T08:00:00Z','price'=>2.80],['timestamp'=>'2026-09-28T08:00:00Z','price'=>2.91],['timestamp'=>'2026-09-29T08:00:00Z','price'=>2.88],['timestamp'=>'2026-09-30T08:00:00Z','price'=>2.84]]
];

function respond($code, $body) {
    http_response_code($code);
    echo json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Supports /api/crypto.php and /api/crypto.php/BTC[/price|/history]
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$script = $_SERVER['SCRIPT_NAME'];
$relative = strpos($path, $script) === 0 ? trim(substr($path, strlen($script)), '/') : '';
$parts = $relative === '' ? [] : explode('/', $relative);

if (count($parts) === 0) {
    respond(200, [
        'status'=>'success',
        'message'=>'Cryptocurrency Market Data API is running',
        'version'=>'1.0.0',
        'endpoints'=>[
            'GET /api/crypto.php',
            'GET /api/crypto.php/{symbol}',
            'GET /api/crypto.php/{symbol}/price',
            'GET /api/crypto.php/{symbol}/history'
        ]
    ]);
}

if (count($parts) > 2 || !preg_match('/^[A-Za-z0-9]+$/', $parts[0])) {
    respond(400, ['status'=>'error','error'=>['code'=>'INVALID_REQUEST','message'=>'Invalid request']]);
}

$symbol = strtoupper($parts[0]);

if (!isset($cryptos[$symbol])) {
    respond(404, ['status'=>'error','error'=>['code'=>'CRYPTO_NOT_FOUND','message'=>"Cryptocurrency '$symbol' was not found"]]);
}

$crypto = $cryptos[$symbol];

if (count($parts) === 1) {
    respond(200, ['status'=>'success','data'=>$crypto]);
}

$action = strtolower($parts[1]);

if ($action === 'price') {
    respond(200, ['status'=>'success','data'=>[
        'symbol'=>$crypto['symbol'],
        'name'=>$crypto['name'],
        'price'=>$crypto['price'],
        'currency'=>$crypto['currency'],
        'price_change_24h'=>$crypto['price_change_24h'],
        'last_updated'=>$crypto['last_updated']
    ]]);
}

if ($action === 'history') {
    $items = $history[$symbol] ?? [];
    respond(200, ['status'=>'success','data'=>[
        'symbol'=>$crypto['symbol'],
        'name'=>$crypto['name'],
        'currency'=>$crypto['currency'],
        'history'=>$items
    ],'meta'=>['total'=>count($items)]]);
}

respond(404, ['status'=>'error','error'=>['code'=>'ENDPOINT_NOT_FOUND','message'=>'Endpoint was not found']]);
?>
