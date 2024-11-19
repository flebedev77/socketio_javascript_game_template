import chalk from "chalk"
import fs from "fs";
import path from "path";
import config from "./config";

const LOG_TYPE = {
    WARNING: 1,
    INFO: 2,
    ERROR: 3
}

function log(msg: any, info_level: Number) {
    const days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];

    let pm = false;

    let date = new Date();

    if (date.getHours() > 12) {
        pm = true;
    }

    let dateStr = chalk.green(`[${days[date.getDay()]}:${(pm) ? "PM" : "AM"}:${(!pm) ? date.getHours() : Math.abs(date.getHours()-12)}:${date.getMinutes()}:${date.getSeconds()}] `);

    if (!fs.existsSync(config.logs_path)) {
        console.warn(chalk.yellow(dateStr + `Logs folder does not exist at ${config.logs_path}`))
        fs.mkdirSync(config.logs_path, { recursive: true });
    }

    if (info_level == LOG_TYPE.WARNING) {
        console.warn(dateStr, chalk.yellow(msg));
    } else if (info_level == LOG_TYPE.ERROR) {
        console.error(dateStr, chalk.red(msg));
    } else if (info_level == LOG_TYPE.INFO) {
        console.log(dateStr, msg);
    }

    try {
        const logger_file_name = date.toLocaleDateString().replaceAll("/", "-");
        fs.appendFileSync(path.join(config.logs_path, logger_file_name) + ".log", dateStr + msg + "\n");
    } catch (e) {
        console.error(chalk.red(dateStr + "Error appending log file "), e);
    }
}

export function log_info(msg: any) {
    log(msg, LOG_TYPE.INFO);
}

export function log_warning(msg: any) {
    log(msg, LOG_TYPE.WARNING);
}

export function log_error(msg: any) {
    log(msg, LOG_TYPE.ERROR);
}