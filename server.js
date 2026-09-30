const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const cryptocurrencies = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 112450.25,
    currency: "USD",
    price_change_24h: 2.45,
    market_cap: 2230000000000,
    volume_24h: 48500000000,
    last_updated: "2026-09-30T08:00:00Z"
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 4215.75,
    currency: "USD",
    price_change_24h: 1.82,
    market_cap: 508000000000,
    volume_24h: 21300000000,
    last_updated: "2026-09-30T08:00:00Z"
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 198.42,
    currency: "USD",
    price_change_24h: -0.75,
    market_cap: 96500000000,
    volume_24h: 5200000000,
    last_updated: "2026-09-30T08:00:00Z"
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 925.15,
    currency: "USD",
    price_change_24h: 3.12,
    market_cap: 137000000000,
    volume_24h: 2400000000,
    last_updated: "2026-09-30T08:00:00Z"
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: 2.84,
    currency: "USD",
    price_change_24h: -1.35,
    market_cap: 168000000000,
    volume_24h: 7100000000,
    last_updated: "2026-09-30T08:00:00Z"
  }
];

const priceHistory = {
  BTC: [
    { timestamp: "2026-09-26T08:00:00Z", price: 108500.25 },
    { timestamp: "2026-09-27T08:00:00Z", price: 109850.75 },
    { timestamp: "2026-09-28T08:00:00Z", price: 111250.50 },
    { timestamp: "2026-09-29T08:00:00Z", price: 110950.10 },
    { timestamp: "2026-09-30T08:00:00Z", price: 112450.25 }
  ],
  ETH: [
    { timestamp: "2026-09-26T08:00:00Z", price: 4050.25 },
    { timestamp: "2026-09-27T08:00:00Z", price: 4110.50 },
    { timestamp: "2026-09-28T08:00:00Z", price: 4185.75 },
    { timestamp: "2026-09-29T08:00:00Z", price: 4140.20 },
    { timestamp: "2026-09-30T08:00:00Z", price: 4215.75 }
  ],
  SOL: [
    { timestamp: "2026-09-26T08:00:00Z", price: 190.25 },
    { timestamp: "2026-09-27T08:00:00Z", price: 194.80 },
    { timestamp: "2026-09-28T08:00:00Z", price: 201.25 },
    { timestamp: "2026-09-29T08:00:00Z", price: 199.75 },
    { timestamp: "2026-09-30T08:00:00Z", price: 198.42 }
  ],
  BNB: [
    { timestamp: "2026-09-26T08:00:00Z", price: 895.50 },
    { timestamp: "2026-09-27T08:00:00Z", price: 905.25 },
    { timestamp: "2026-09-28T08:00:00Z", price: 918.40 },
    { timestamp: "2026-09-29T08:00:00Z", price: 910.75 },
    { timestamp: "2026-09-30T08:00:00Z", price: 925.15 }
  ],
  XRP: [
    { timestamp: "2026-09-26T08:00:00Z", price: 2.75 },
    { timestamp: "2026-09-27T08:00:00Z", price: 2.80 },
    { timestamp: "2026-09-28T08:00:00Z", price: 2.91 },
    { timestamp: "2026-09-29T08:00:00Z", price: 2.88 },
    { timestamp: "2026-09-30T08:00:00Z", price: 2.84 }
  ]
};

function findCrypto(symbol) {
  return cryptocurrencies.find(
    crypto => crypto.symbol === symbol.toUpperCase()
  );
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Cryptocurrency Market Data API is running",
    version: "1.0.0"
  });
});

app.get("/api/crypto", (req, res) => {
  res.status(200).json({
    status: "success",
    data: cryptocurrencies,
    meta: { total: cryptocurrencies.length }
  });
});

app.get("/api/crypto/:symbol", (req, res) => {
  const symbol = req.params.symbol;

  if (!/^[a-zA-Z0-9]+$/.test(symbol)) {
    return res.status(400).json({
      status: "error",
      error: {
        code: "INVALID_SYMBOL",
        message: "Cryptocurrency symbol is invalid"
      }
    });
  }

  const crypto = findCrypto(symbol);

  if (!crypto) {
    return res.status(404).json({
      status: "error",
      error: {
        code: "CRYPTO_NOT_FOUND",
        message: `Cryptocurrency '${symbol.toUpperCase()}' was not found`
      }
    });
  }

  res.status(200).json({
    status: "success",
    data: crypto
  });
});

app.get("/api/crypto/:symbol/price", (req, res) => {
  const symbol = req.params.symbol;

  if (!/^[a-zA-Z0-9]+$/.test(symbol)) {
    return res.status(400).json({
      status: "error",
      error: {
        code: "INVALID_SYMBOL",
        message: "Cryptocurrency symbol is invalid"
      }
    });
  }

  const crypto = findCrypto(symbol);

  if (!crypto) {
    return res.status(404).json({
      status: "error",
      error: {
        code: "CRYPTO_NOT_FOUND",
        message: `Cryptocurrency '${symbol.toUpperCase()}' was not found`
      }
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      symbol: crypto.symbol,
      name: crypto.name,
      price: crypto.price,
      currency: crypto.currency,
      price_change_24h: crypto.price_change_24h,
      last_updated: crypto.last_updated
    }
  });
});

app.get("/api/crypto/:symbol/history", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  if (!/^[A-Z0-9]+$/.test(symbol)) {
    return res.status(400).json({
      status: "error",
      error: {
        code: "INVALID_SYMBOL",
        message: "Cryptocurrency symbol is invalid"
      }
    });
  }

  const crypto = findCrypto(symbol);

  if (!crypto) {
    return res.status(404).json({
      status: "error",
      error: {
        code: "CRYPTO_NOT_FOUND",
        message: `Cryptocurrency '${symbol}' was not found`
      }
    });
  }

  const history = priceHistory[symbol] || [];

  res.status(200).json({
    status: "success",
    data: {
      symbol: crypto.symbol,
      name: crypto.name,
      currency: crypto.currency,
      history
    },
    meta: { total: history.length }
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    error: {
      code: "ENDPOINT_NOT_FOUND",
      message: `Endpoint ${req.method} ${req.originalUrl} was not found`
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: "error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Crypto Market API running on port ${PORT}`);
});
