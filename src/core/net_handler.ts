import { Socket } from "socket.io";
import globals from "./globals";
import { Snake } from "../game_objects/snake";
import { Vector2, class_list_to_object_list, get_player, line_circle_collision } from "./utils";
import { log_error, log_info, log_warning } from "../logger";

export function handle_connection(socket: Socket) {
    globals.players[socket.id] = new Snake(Math.random() * globals.map_size.width, Math.random() * globals.map_size.height);

    // Tell other players this player joined
    socket.broadcast.emit("new_player", globals.players[socket.id].to_object(), socket.id)

    socket.on("socket_client_ready", (username, callback) => {
        if (typeof username != "string" || username.trim() == "") {
            disconnect_player_str(socket.id);
            log_error(`Invalid username: ${socket.id} ${username}`);
            return;
        }

        log_info(`Socket ready: ${socket.id} ${username}`);

        const player = get_player(socket.id);

        if (player == undefined) {
            log_warning(`Player with id ${socket.id} does not exist!`);
            return;
        }

        // Tell current player about other players
        socket.emit("update_players", globals.players);

        // Tell the current player about the food on the server
        socket.emit("local_player_food_sync", class_list_to_object_list(globals.food_list));

        // local_player_server_handshake: does the initial sync of the clientside player to the serverside player
        socket.emit("local_player_server_handshake", player.to_object());


        callback();
    })

    socket.on("disconnect", () => {
        disconnect_player(socket);
    })

    socket.on("player_update", (move_direction) => {
        const player = get_player(socket.id);
        if (player == null) return;
        player.move_direction = new Vector2(move_direction.x, move_direction.y);
        send_player_update(socket, socket.id);
    })

    socket.on("player_stop", () => {
        const player = get_player(socket.id);
        if (player == null) return;
        player.move_direction = new Vector2(0, 0);
        send_player_update(socket, socket.id);
    })

    socket.on("player_sprint_start", () => {
        const player = get_player(socket.id);
        if (player == null) return;
        player.sprint(true);
        socket.broadcast.emit("player_sprint_start", socket.id);
    })

    socket.on("player_sprint_stop", () => {
        const player = get_player(socket.id);
        if (player == null) return;
        player.sprint(false);
        socket.broadcast.emit("player_sprint_stop", socket.id);
    })

    socket.on("player_check_eat", () => {
        const player = get_player(socket.id);
        if (player == null) return;

        const eat_checked = player.check_eat();

        if (!eat_checked) {
            // Player cheated
            // log_warning("CHEATER DETECTED! " + socket.id + ".... kicking");
            // socket.emit("player_kick");
            // delete globals.players[socket.id];
            // globals.io.emit("socket_disconnected", socket.id); // Kick him 
        } else {
            player.eat(globals.food_give_segment_amount, globals.food_give_radius_amount);
            socket.broadcast.emit("player_ate", socket.id);
        }
    })
}

function send_player_update(socket: Socket, id: string) {
    socket.broadcast.emit("player_update", id, globals.players[id].position.to_object(), globals.players[id].move_direction.to_object());
}

export function network_heartbeat() {
    for (const player_socket_id in globals.players) {
        const player_a = get_player(player_socket_id);
        if (player_a == null) continue;

        globals.io.emit("local_player_sync", player_socket_id, player_a.to_object());


        //death collisions
        for (const b_player_socket_id in globals.players) {
            if (b_player_socket_id == player_socket_id) continue;
            const player_b = get_player(b_player_socket_id);
            if (player_b == null) continue;

            for (let i = 0; i < player_b.tail.length; ++i) {
                const tail_segment = player_b.tail[i];

                if (line_circle_collision(tail_segment, {
                    x: player_a.position.x,
                    y: player_a.position.y,
                    radius: player_a.head_radius,
                })) {
                    globals.io.to(player_socket_id).emit("killed");
                    disconnect_player_str(player_socket_id);
                }
            }
        }
    }
}

export function init_network() {
    const io = globals.io;
}

function disconnect_player(socket: Socket) {
    disconnect_player_str(socket.id);
}

function disconnect_player_str(socket_id: string) {
    delete globals.players[socket_id];
    globals.io.emit("socket_disconnected", socket_id);
}