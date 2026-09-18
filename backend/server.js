const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/db');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Routes métier - montées au fur et à mesure des phases
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/players', require('./routes/player.routes'));
app.use('/api/academies', require('./routes/academy.routes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const payload = { message: err.message || 'Internal server error' };

//   if (env.isDevelopment && err.stack) {
//     payload.stack = err.stack;
//   }

//   if (status >= 500) {
//     console.error('[error]', err);
//   }

//   res.status(status).json(payload);
// });



// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const payload = { message: err.message || 'Internal server error' };

  if (err.details !== undefined) {
    payload.details = err.details;
  }

  if (env.isDevelopment && err.stack) {
    payload.stack = err.stack;
  }

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json(payload);
});











let server;

async function start() {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      console.log(`[server] Football OS API listening on port ${env.port} - env=${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('[server] Startup failed:', error.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`[server] Received ${signal}, shutting down gracefully`);

  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();