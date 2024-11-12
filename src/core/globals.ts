import { Server } from "socket.io"
import type { Snake } from "../game_objects/snake"


export default {
    players: {} as { [id: string]: Snake },
    player_speed: {
        normal: 0.2,
        sprint: 0.4,
    },
    io: new Server(),

    update_speed: 1000/60,
    delta_time: Date.now(),
    current_time: Date.now(),
    previous_update_time: Date.now(),

    server_heartbeat_rate: 700, //every 700 milliseconds sync all clients
}