import globals from "./globals.js";
import { Snake } from "../game_objects/snake.js";
import { Vector2 } from "../utils.js";

export function init_network() {
    const socket = globals.socket;

    window.addEventListener("DOMContentLoaded", () => {
        socket.emit("socket_client_ready");
    })

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

    socket.on("player_update", (player_socket_id, player_new_position, player_new_move_direction) => {
        globals.network_players[player_socket_id].move_direction = Vector2.from_object(player_new_move_direction);

        globals.network_players[player_socket_id].position.x = player_new_position.x;
        globals.network_players[player_socket_id].position.y = player_new_position.y;
    })

    socket.on("local_player_sync", (id, server_player) => {
        if (id != socket.id) return;
        globals.local_player.position.x = server_player.position.x;
        globals.local_player.position.y = server_player.position.y;
        globals.local_player.move_direction = Vector2.from_object(server_player.move_direction);
    })

    socket.on("player_sprint_start", (id) => {
        globals.network_players[id].sprint(true);
    })

    socket.on("player_sprint_stop", (id) => {
        globals.network_players[id].sprint(false);
    })
}

export function network_heartbeat() {
    const socket = globals.socket;
    if (Vector2.magnitude(globals.local_player.move_direction) != 0) {
        socket.emit("player_update", globals.local_player.move_direction.to_object());
    } else {
        socket.emit("player_stop");
    }
}

//called by the player to trigger a network request
export function network_event(event_type) {
    const socket = globals.socket;
    switch (event_type) {
        case globals.network_event_type.sprint.start:
            socket.emit("player_sprint_start");
            break;
        case globals.network_event_type.sprint.stop:
            socket.emit("player_sprint_stop");
            break;
    }
}