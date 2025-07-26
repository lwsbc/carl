// bookieutils/logger.js
import pino from 'pino';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'Bookielogs');
if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    // any other pino options here…
  },
  // write directly to a file, non-blocking
  pino.destination({
    dest: path.join(LOG_DIR, 'dev.log'),
    sync: false,    // asynchronous writes
  })
);

// then re‑export your wrappers
export const { info, warn, error, debug, trace } = logger;
