import selector from "./selector.js";

export default {
    canvas_context: selector.canvas.getContext("2d"),
    socket: io(),
    update_speed: 1000/60,
    previous_time: Date.now(),
    current_time: Date.now(),
    delta_time: 0,
    fps: 60, //Does not actually control the update speed. Use "update_speed"
    fps_display_delay: 0,
    fps_display_rate: 100
}