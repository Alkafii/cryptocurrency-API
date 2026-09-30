# Cryptocurrency Market Data REST API

Dummy/mock REST API menggunakan Node.js + Express. Data disimpan di memory sehingga tidak membutuhkan database.

## Requirements

- Node.js 18+ disarankan
- npm

## Menjalankan lokal

```bash
npm install
npm start
```

API berjalan di:

```text
http://localhost:3000
```

## Endpoint

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | Health check |
| GET | `/api/crypto` | Daftar semua crypto |
| GET | `/api/crypto/BTC` | Detail BTC |
| GET | `/api/crypto/BTC/price` | Harga BTC |
| GET | `/api/crypto/BTC/history` | History BTC |

Ganti `BTC` dengan `ETH`, `SOL`, `BNB`, atau `XRP`.

## Contoh

```text
GET http://localhost:3000/api/crypto
GET http://localhost:3000/api/crypto/BTC
GET http://localhost:3000/api/crypto/BTC/price
GET http://localhost:3000/api/crypto/BTC/history
```

## Response

Semua response menggunakan JSON.

## Deploy / Hosting

File minimum yang perlu di-host:

- `server.js`
- `package.json`

`node_modules/` TIDAK perlu di-upload.

Hosting akan menjalankan:

```bash
npm install
npm start
```

Port sudah menggunakan:

```javascript
process.env.PORT || 3000
```

sehingga kompatibel dengan hosting yang memberikan port melalui environment variable.

## Postman / Bruno

Base URL setelah deploy:

```text
https://DOMAIN-ANDA
```

Contoh:

```text
GET https://DOMAIN-ANDA/api/crypto
GET https://DOMAIN-ANDA/api/crypto/BTC
GET https://DOMAIN-ANDA/api/crypto/BTC/price
GET https://DOMAIN-ANDA/api/crypto/BTC/history
```
