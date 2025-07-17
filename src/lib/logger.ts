/**
 * Comprehensive Logging System
 * Provides structured logging with different levels and contexts
 */

import { isDevelopment, isProduction, features } from '@/lib/config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private minLevel: LogLevel;
  private sessionId: string;
  private userId?: string;
  private buffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;

  constructor() {
    this.minLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    this.sessionId = this.generateSessionId();
    
    // Flush buffer periodically in production
    if (isProduction) {
      setInterval(() => this.flushBuffer(), 30000); // Every 30 seconds
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return features.enableLogging && level >= this.minLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      userId: this.userId,
      sessionId: this.sessionId,
    };
  }

  private formatLogMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    
    let message = `[${timestamp}] ${levelName}: ${entry.message}`;
    
    if (entry.context) {
      message += ` | Context: ${JSON.stringify(entry.context)}`;
    }
    
    if (entry.userId) {
      message += ` | User: ${entry.userId}`;
    }
    
    return message;
  }

  private writeToConsole(entry: LogEntry): void {
    const message = this.formatLogMessage(entry);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
        console.error(message, entry.error);
        break;
    }
  }

  private addToBuffer(entry: LogEntry): void {
    this.buffer.push(entry);
    
    // Prevent buffer overflow
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer = this.buffer.slice(-this.maxBufferSize);
    }
  }

  private async sendToExternalService(entries: LogEntry[]): Promise<void> {
    // This would be implemented to send logs to external services
    // like Sentry, LogRocket, or a custom logging service
    
    if (isDevelopment) {
      console.log('Would send to external logging service:', entries);
      return;
    }
    
    // Example implementation for production
    try {
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entries),
      // });
    } catch (error) {
      console.error('Failed to send logs to external service:', error);
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;
    
    const entries = [...this.buffer];
    this.buffer = [];
    
    if (isProduction) {
      await this.sendToExternalService(entries);
    }
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.writeToConsole(entry);
    this.addToBuffer(entry);
  }

  public info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.writeToConsole(entry);
    this.addToBuffer(entry);
  }

  public warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.writeToConsole(entry);
    this.addToBuffer(entry);
  }

  public error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.writeToConsole(entry);
    this.addToBuffer(entry);
    
    // Immediately flush critical errors
    if (isProduction) {
      this.flushBuffer();
    }
  }

  public async flush(): Promise<void> {
    await this.flushBuffer();
  }

  public getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  public clearBuffer(): void {
    this.buffer = [];
  }
}

// Create singleton instance
export const logger = new Logger();

// Helper functions for common logging patterns
export const logApiCall = (method: string, url: string, status?: number, duration?: number) => {
  const context = { method, url, status, duration };
  
  if (status && status >= 400) {
    logger.error(`API call failed: ${method} ${url}`, undefined, context);
  } else {
    logger.info(`API call: ${method} ${url}`, context);
  }
};

export const logUserAction = (action: string, userId?: string, context?: LogContext) => {
  logger.info(`User action: ${action}`, { ...context, userId });
};

export const logFormSubmission = (formType: string, success: boolean, context?: LogContext) => {
  const message = `Form submission: ${formType} - ${success ? 'success' : 'failed'}`;
  if (success) {
    logger.info(message, context);
  } else {
    logger.error(message, undefined, context);
  }
};

export const logPerformance = (operation: string, duration: number, context?: LogContext) => {
  const message = `Performance: ${operation} took ${duration}ms`;
  const logContext = { ...context, duration, operation };
  
  if (duration > 1000) {
    logger.warn(message, logContext);
  } else {
    logger.debug(message, logContext);
  }
};

// React hook for component logging
export const useLogger = () => {
  const logComponentMount = (componentName: string) => {
    logger.debug(`Component mounted: ${componentName}`);
  };

  const logComponentUnmount = (componentName: string) => {
    logger.debug(`Component unmounted: ${componentName}`);
  };

  const logComponentError = (componentName: string, error: Error) => {
    logger.error(`Component error: ${componentName}`, error);
  };

  return {
    logComponentMount,
    logComponentUnmount,
    logComponentError,
    logger,
  };
};

// Development helper
if (isDevelopment) {
  (window as any).logger = logger;
  logger.info('Logger initialized in development mode');
}