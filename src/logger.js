export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

let _verbosity = LOG_LEVELS.INFO;

export const reduxLogger = (verbosity) => (store) => (next) => (action) => {
  Logger.log(verbosity, 'executing action', action);
  return next(action);
};

/**
 * Encapsulates the logging mechanism.
 * Only print the messages that really matter by setting the right verbosity.
 */
export default class Logger {
  /**
   * The verbosity controls which log messages actually are printed out to the log.
   *
   * @param {LOG_LEVELS} verbosity Sets the chattiness of the logger.
   * @return {void}
   */
  static setVerbosity(verbosity) {
    _verbosity = verbosity;
  }

  /**
   * Logs given arguments to the output.
   *
   * @param {LOG_LEVELS} verbosity Which verbosity level this log message is.
   * @param {any[]} args Any kind of types that should be logged out.
   * @return {void}
   */
  static log(verbosity, ...args) {
    switch (verbosity) {
      case LOG_LEVELS.DEBUG:
        Logger.debug.apply(null, args);
        break;
      case LOG_LEVELS.WARN:
        Logger.warn.apply(null, args);
        break;
      case LOG_LEVELS.ERROR:
        Logger.error.apply(null, args);
        break;
      default:
        Logger.info.apply(null, args);
    }
  }

  /**
   * Logs a message with verbosity level set to debug.
   *
   * @param {any[]} args Any kind of objects to log.
   * @return {void}
   */
  static debug(...args) {
    if (_verbosity <= LOG_LEVELS.DEBUG) {
      console.debug(...args);
    }
  }

  /**
   * Logs a message with verbosity level set to info.
   *
   * @param {any[]} args Any kind of objects to log.
   * @return {void}
   */
  static info(...args) {
    if (_verbosity <= LOG_LEVELS.INFO) {
      console.log(...args);
    }
  }

  /**
   * Logs a message with verbosity level set to warn.
   *
   * @param {any[]} args Any kind of objects to log.
   * @return {void}
   */
  static warn(...args) {
    if (_verbosity <= LOG_LEVELS.WARN) {
      console.warn(...args);
    }
  }

  /**
   * Logs a message with verbosity level set to error.
   *
   * @param {any[]} args Any kind of objects to log.
   * @return {void}
   */
  static error(...args) {
    if (_verbosity <= LOG_LEVELS.ERROR) {
      console.error(...args);
    }
  }
}
