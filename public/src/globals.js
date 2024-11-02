import selector from "./selector.js";

export default {
    canvas_context: selector.canvas.getContext("2d"),
    socket: io(),

    //time
    update_speed: 1000/60,
    previous_time: Date.now(),
    current_time: Date.now(),
    delta_time: 0,

    //fps display
    fps: 60, //Does not actually control the update speed. Use "update_speed"
    fps_display_delay: 0,
    fps_display_rate: 100,

    //player
    local_player: null,
    player_tail_size_offset_from_zero: 4, //If set to zero, the last tail segment will be infinitly thin and short

    //food
    food_give_segment_amount: 5,
    food_give_radius_amount: 5,
    food_colors: ["red", "green", "blue", "orange", "purple"],
    food_arr: [],
}