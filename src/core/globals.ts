import { Server } from "socket.io"
import type { Snake } from "../game_objects/snake"
import type { Food } from "../game_objects/food"


export default {
    players: {} as { [id: string]: Snake },
    player_speed: {
        normal: 0.2,
        sprint: 0.4,
    },
    player_segment: {
        radius: 10, // Radius of first segment
        length: 20, // Length of first segment
        amount: 10, // Amount of total segments in tail in the beggning
    },
    player_head_size_multiplier: 1.5, // The actual head radius will be the radius of the first tail segment times this
    player_tail_size_offset_from_zero: 8,
    io: new Server(),

    update_speed: 1000 / 60,
    delta_time: Date.now(),
    current_time: Date.now(),
    previous_update_time: Date.now(),

    server_heartbeat_rate: 700, //every 700 milliseconds sync all clients

    food_list: [] as Food[],
    food_amount: 100,
    food_radius: 10,
    food_give_segment_amount: 1,
    food_give_radius_amount: 1,


    //map
    map_size: {
        width: 1366,
        height: 639,
    },
}