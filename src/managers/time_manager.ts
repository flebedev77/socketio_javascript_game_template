import globals from "../core/globals";

export default function time_manager_handler_func() {
    globals.previous_update_time = globals.current_time;
    globals.current_time = Date.now();
    globals.delta_time = globals.current_time - globals.previous_update_time;
}