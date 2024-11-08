import globals from "./globals.js";
import { Snake } from "../game_objects/snake.js";

export function init_network() {
    const socket = globals.socket;

    socket.on("connect", () => {
        //If was reconnected (if the server crashed and came back up) then refresh the client
        if (globals.socket_previously_connected) {
            window.location.reload();
            return;
        }
        globals.socket_previously_connected = true;
    })

    socket.on("local_player_server_handshake", (local_snake_from_server) => {
        globals.local_player = new Snake(local_snake_from_server.position.x, local_snake_from_server.position.y, 10);
        globals.local_player.is_local_player = true;
        globals.local_player.init();
    })

    socket.on("update_players", (players) => {
        globals.network_players = {};

        for (const network_player_socket_id in players) {
            if (network_player_socket_id != socket.id) {

                const network_player = players[network_player_socket_id];

                globals.network_players[network_player_socket_id] = new Snake(
                    network_player.position.x,
                    network_player.position.y,
                    10,
                );
            }
        }
    })

    socket.on("new_player", (player, player_socket_id) => {
        if (player_socket_id == socket.id) return;

        globals.network_players[player_socket_id] = new Snake(
            player.position.x,
            player.position.y,
            10,
        );
    })

    socket.on("socket_disconnected", (disconnected_player_socket_id) => {
        delete globals.network_players[disconnected_player_socket_id];
    })
}

export function network_heartbeat() {
   socket.emit("player_update", globals.local_player.move_direction.to_object());
}