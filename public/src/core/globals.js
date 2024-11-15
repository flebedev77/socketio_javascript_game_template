import selector from "../front_end/selector.js";
import { Snake } from "../game_objects/snake.js";
import { Vector2 } from "../utils.js";

export default {
    canvas_context: selector.canvas.getContext("2d"),

    //time
    update_speed: 1000/60,
    previous_time: Date.now(),
    current_time: Date.now(),
    delta_time: 0,
    performance_timer: {
        start_time: 0,
        stop_time: 0,
        time_passed: 0,
        running: false,
    },

    //fps display
    fps: 60, //Does not actually control the update speed. Use "update_speed"
    fps_display_delay: 0,
    fps_display_rate: 100,

    //player
    local_player: null, //Player initialized in networking.js
    player_tail_size_offset_from_zero: 8, //If set to zero, the last tail segment will be infinitly thin and short
    local_player_colors: ["#4A2C0B", "#73610E"],
    network_player_colors: ["#181C14", "#3C3D37"],
    player_head_size_multiplier: 1.5,
    player_minumum_mouse_follow_distance: 5,
    player_speed: {
        normal: 0.2,
        sprint: 0.4,
    },
    player_sprint_weight_loss: {
        rate: 1000,
        food_drop_rate: 1500,
        segment_loss: 1,
        segment_thickness_loss: 1,
        minumum_segments_for_loss: 4,
        minumum_segment_radius_for_loss: 8,
    },

    //food
    food_give_segment_amount: 1,
    food_give_radius_amount: 1,
    food_radius: 5,
    food_colors: ["gray"], // Not using these, because we want to avoid sending colors over the wire "red", "green", "blue", "orange", "purple"],
    food_arr: [],

    //keyboard
    keys: {
        up: false,
        left: false,
        right: false,
        down: false,
        space: false,
        last_input_time: Date.now(),
    },

    //mouse
    mouse: {
        left: {
            down: false,
        },
        position: new Vector2(0, 0),
        last_input_time: Date.now(),
    },

    //action
    input_actions: {
        sprint: false,
        type: {
            MOUSE: 1,
            KEYBOARD: 2,
        },
    },

    //networking
    socket: io(),
    socket_previously_connected: false,
    network_players: {},
    network_update_ping: 1000, //So that the clients dont ddos the server
    network_event_type: { //Make sure values are all unique
        sprint: {
            start: 1,
            stop: 2,
        },
        check_eat: 3,
    },
}