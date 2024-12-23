import globals from "./globals.js";
import selector from "../front_end/selector.js";
import { Snake } from "../game_objects/snake.js";
import { alert_popup, Vector2 } from "../utils.js";
import { Food } from "../game_objects/food.js";
import reset from "../managers/reset_manager.js";

export function init_network() {
    const socket = globals.socket;

    //Notify the server as soon as the socket is able to send/receive messages
    const socket_ready_interval = setInterval(() => {
        socket.emit("socket_client_ready", globals.username, () => {
            selector.connecting_screen.style.display = "none";
            clearInterval(socket_ready_interval);
        });
    }, 500);

    socket.on("connect", () => {
        //If was reconnected (if the server crashed and came back up) then refresh the client
        if (globals.socket_previously_connected) {
            window.location.reload();
            return;
        }
        globals.socket_previously_connected = true;
    })

    socket.on("player_kick", () => {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    })

    //these happen at the initial connection once
    socket.on("local_player_server_handshake", (local_snake_from_server) => {
        globals.local_player = new Snake(local_snake_from_server.position.x, local_snake_from_server.position.y, 10);
        globals.local_player.is_local_player = true;
        globals.local_player.init();
    })
    socket.on("local_player_food_sync", (player_food_arr) => {
        globals.food_arr = [];

        player_food_arr.forEach((food_object) => {
            globals.food_arr.push(new Food(
                food_object.position.x, food_object.position.y,
                food_object.radius
            ));
        })
    })



    socket.on("update_players", (players) => {
        globals.network_players = {};

        for (const network_player_socket_id in players) {
            if (network_player_socket_id != socket.id) {

                const network_player = players[network_player_socket_id];


                globals.network_players[network_player_socket_id] = new Snake(
                    network_player.position.x,
                    network_player.position.y,
                    network_player.segment_radius,
                    network_player.segment_amount,
                    network_player.segment_length
                );
                globals.network_players[network_player_socket_id].username = network_player.username;

                try {
                    network_player.tail.forEach((tail_segment, i) => {
                        const local_network_player_tail_segment = globals.network_players[network_player_socket_id].tail[i];
                        local_network_player_tail_segment.a.x = tail_segment.a.x;
                        local_network_player_tail_segment.a.y = tail_segment.a.y;
                        local_network_player_tail_segment.b.x = tail_segment.b.x;
                        local_network_player_tail_segment.b.y = tail_segment.b.y;
                    })
                } catch (e) {
                    console.error(`Error setting ${network_player_socket_id} tail position `, e);
                }
            }
        }
    })

    socket.on("new_player", (player, player_socket_id, username) => {
        if (player_socket_id == socket.id) return;

        globals.network_players[player_socket_id] = new Snake(
            player.position.x,
            player.position.y,
            10,
        );
        globals.network_players[player_socket_id].username = username;
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

    socket.on("player_ate", (id) => {
        globals.network_players[id].eat(globals.food_give_segment_amount, globals.food_give_radius_amount);
    })

    socket.on("killed", (id) => {
        alert_popup("Dead", `You were killed by ${globals.network_players[id].username}`, "Continue");

        reset();

        selector.start_dialog.style.display = "";
        selector.connecting_screen.style.display = "";
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
export function network_event(event_type, event_data = {}) {
    const socket = globals.socket;
    switch (event_type) {
        case globals.network_event_type.sprint.start:
            socket.emit("player_sprint_start");
            break;
        case globals.network_event_type.sprint.stop:
            socket.emit("player_sprint_stop");
            break;
        case globals.network_event_type.check_eat:
            socket.emit("player_check_eat");
            break;
    }
}