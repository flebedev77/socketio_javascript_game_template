import globals from "../core/globals";
import { network_heartbeat } from "../core/net_handler";

let server_heartbeat_delay = 0;

export default function network_manager_handler_func() {
    sync_client_player_to_server_player();
}

function sync_client_player_to_server_player() {
    server_heartbeat_delay += globals.delta_time;
    if (server_heartbeat_delay > globals.server_heartbeat_rate) {
        server_heartbeat_delay = 0;
        network_heartbeat();        
    }
}