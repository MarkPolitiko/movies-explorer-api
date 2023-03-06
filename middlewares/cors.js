const allowedParams = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://movieforyou.nomoredomains.work',
    'https://movieforyou.nomoredomains.work',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

module.exports = { allowedParams };
