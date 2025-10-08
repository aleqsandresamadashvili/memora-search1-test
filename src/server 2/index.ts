import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import pinoHttp from 'pino-http';
import routes from '../routes';

const app = express();

const logger = pino({ transport: { target: 'pino-pretty' } });
app.use(pinoHttp({ logger }));

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Serve static files from current directory
app.use(express.static('.'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use('/api', routes);

// Serve the main HTML file for root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  logger.info(`API listening on port ${port}`);
});
