import * as config from "../core/globals.js";
import { deep_copy, deep_merge } from "../utils.js";


export default function reset() {
    config.globals.gameloop_running = false;
    setTimeout(() => {
        deep_merge(config.globals, config.unchanged_globals);
    }, config.globals.fps);
}