export enum LogLevel {
  DEBUG = "debug",
  INFO = "infor",
  WARN = "warni",
  ERROR = "error",
}

const colors: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "\x1b[37m",
  [LogLevel.INFO]: "\x1b[39m",
  [LogLevel.WARN]: "\x1b[33m",
  [LogLevel.ERROR]: "\x1b[31m",
};

const resetColor = "\x1b[0m";

function log(level: LogLevel, message: string) {
  const timestamp = new Date().toISOString();
  console.log(
    `${
      colors[level]
    }[${level.toUpperCase()}] ${timestamp} - ${message}${resetColor}`
  );
}

export const logger = {
  debug: (message: string) => log(LogLevel.DEBUG, message),
  info: (message: string) => log(LogLevel.INFO, message),
  warn: (message: string) => log(LogLevel.WARN, message),
  error: (message: string) => log(LogLevel.ERROR, message),
};
