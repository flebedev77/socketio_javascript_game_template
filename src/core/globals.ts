import { Server } from "socket.io"
import type { Snake } from "../game_objects/snake"


export default {
    players: {} as { [id: string]: Snake },
    player_speed: 5,
    io: new Server(),

    update_speed: 1000/60,
    delta_time: Date.now(),
    current_time: Date.now(),
    previous_update_time: Date.now(),
}