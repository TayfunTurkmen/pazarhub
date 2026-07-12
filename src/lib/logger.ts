type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  route?: string;
  userId?: string;
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...context,
  };
  return JSON.stringify(entry);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message, context));
    }
  },
  info(message: string, context?: LogContext) {
    console.info(formatMessage('info', message, context));
  },
  warn(message: string, context?: LogContext) {
    console.warn(formatMessage('warn', message, context));
  },
  error(message: string, context?: LogContext) {
    console.error(formatMessage('error', message, context));
  },
};

export function createRequestId(): string {
  return crypto.randomUUID();
}
