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
    let date = new Date();
    let dateStr = `[${date.getDay()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] `;

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
        fs.appendFileSync(path.join(config.logs_path, date.getDay().toString()) + ".log", dateStr + msg + "\n");
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