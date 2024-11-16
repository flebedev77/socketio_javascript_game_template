import { Socket } from "socket.io";
import globals from "./globals";
import { Snake } from "../game_objects/snake";
import { Vector2, class_list_to_object_list } from "./utils";
import { log_info, log_warning } from "../logger";

export function handle_connection(socket: Socket) {
    globals.players[socket.id] = new Snake(Math.random() * globals.map_size.width, Math.random() * globals.map_size.height);

    // Tell other players this player joined
    socket.broadcast.emit("new_player", globals.players[socket.id].to_object(), socket.id)

    socket.on("socket_client_ready", (callback) => {
        log_info("Socket ready: " + socket.id);

        // Tell current player about other players
        socket.emit("update_players", globals.players);
        
        // Tell the current player about the food on the server
        socket.emit("local_player_food_sync", class_list_to_object_list(globals.food_list));

        // local_player_server_handshake: does the initial sync of the clientside player to the serverside player
        socket.emit("local_player_server_handshake", globals.players[socket.id].to_object());


        callback();
    })

    socket.on("disconnect", () => {
        delete globals.players[socket.id];
        globals.io.emit("socket_disconnected", socket.id);
    })

    socket.on("player_update", (move_direction) => {
        globals.players[socket.id].move_direction = new Vector2(move_direction.x, move_direction.y);
        send_player_update(socket, socket.id);
    })

    socket.on("player_stop", () => {
        globals.players[socket.id].move_direction = new Vector2(0, 0);
        send_player_update(socket, socket.id);
    })

    socket.on("player_sprint_start", () => {
        globals.players[socket.id].sprint(true);
        socket.broadcast.emit("player_sprint_start", socket.id);
    })

    socket.on("player_sprint_stop", () => {
        globals.players[socket.id].sprint(false);
        socket.broadcast.emit("player_sprint_stop", socket.id);
    })

    socket.on("player_check_eat", () => {
        const eat_checked = globals.players[socket.id].check_eat();

        if (!eat_checked) {
            // Player cheated
            // log_warning("CHEATER DETECTED! " + socket.id + ".... kicking");
            // socket.emit("player_kick");
            // delete globals.players[socket.id];
            // globals.io.emit("socket_disconnected", socket.id); // Kick him 
        } else {
            socket.broadcast.emit("player_ate", socket.id);
        }
    })
}

function send_player_update(socket: Socket, id: string) {
    socket.broadcast.emit("player_update", id, globals.players[id].position.to_object(), globals.players[id].move_direction.to_object());
}

export function network_heartbeat() {
    for (const player_socket_id in globals.players) {
        globals.io.emit("local_player_sync", player_socket_id, globals.players[player_socket_id].to_object());
    }
}

export function init_network() {
    const io = globals.io;
}