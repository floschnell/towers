export const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

let _verbosity = LOG_LEVELS.INFO;

export const reduxLogger = verbosity => store => next => action => {
    Logger.log(verbosity, 'executing action', action);
    return next(action);
};

export default class Logger {

    static setVerbosity(verbosity) {
        console.log(verbosity);
        _verbosity = verbosity;
    }

    static log(verbosity, ...args) {
        console.log(verbosity);
        switch(verbosity) {
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

    static debug(...args) {
        if (_verbosity <= LOG_LEVELS.DEBUG) {
            console.debug.apply(console, args);
        }
    }

    static info(...args) {
        if (_verbosity <= LOG_LEVELS.INFO) {
            console.log.apply(console, args);
        }
    }

    static warn(...args) {
        if (_verbosity <= LOG_LEVELS.WARN) {
            console.warn.apply(console, args);
        }
    }

    static error(...args) {
        if (_verbosity <= LOG_LEVELS.ERROR) {
            console.error.apply(console, args);
        }
    }
}
