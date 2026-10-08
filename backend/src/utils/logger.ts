type LogLevel = "info" | "warn" | "error"

interface LogContext {
    [key: string]: unknown
}

const log = (level: LogLevel, message: string, context: LogContext = {}) => {

    console.log(
        JSON.stringify({
            timestamp: new Date().toISOString(),
            level,
            message,
            ...context
        })
    )
}

export const logger = {
    info: (message: string, context?: LogContext) =>
        log("info", message, context),
    warn: (message: string, context?: LogContext) => 
        log("warn", message, context),
    error: (message: string, context?: LogContext) => 
        log("error", message, context)
}

