// TODO: introduce a propper logger

export const logger = {
  log: (...args: Parameters<Console["log"]>) => console.log(...args),
  warn: (...args: Parameters<Console["warn"]>) => console.warn(...args),
  error: (...args: Parameters<Console["error"]>) => console.error(...args),
};
