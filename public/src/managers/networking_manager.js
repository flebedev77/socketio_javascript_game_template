import { Vector2 } from "../utils.js";
import { network_heartbeat } from "../core/networking.js";
import globals from "../core/globals.js";

let network_ping_delay = 0;

export default function networking_manager() {
    for (const network_socket_id in globals.network_players) {
        const network_player = globals.network_players[network_socket_id];
        network_player.update();
    }


    network_ping_delay += globals.delta_time;

    if (network_ping_delay > globals.network_update_ping && Vector2.magnitude(globals.local_player.move_direction)) {
        network_ping_delay = 0;
        network_heartbeat();
    }
}