import { Socket } from "socket.io";
import globals from "./globals";
import { Snake } from "../game_objects/snake";
import { Vector2 } from "./utils";

export function handle_connection(socket: Socket) {
    globals.players[socket.id] = new Snake(Math.random() * 600, Math.random() * 400);

    socket.emit("update_players", globals.players);
    socket.emit("local_player_server_handshake", globals.players[socket.id]);
    socket.broadcast.emit("new_player", globals.players[socket.id], socket.id)

    socket.on("disconnect", () => {
        delete globals.players[socket.id];
        globals.io.emit("socket_disconnected", socket.id);
    })

    socket.on("player_update", (move_direction) => {
        globals.players[socket.id].move_direction = new Vector2(move_direction.x, move_direction.y);
    })
}

export function init_network() {
    const io = globals.io;
}