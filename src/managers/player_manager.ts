import globals from "../core/globals"

export default function player_manager_handler_func() {
    for (const player_id in globals.players) {
        const player = globals.players[player_id];

        player.position.x += player.move_direction.x * globals.player_speed * globals.delta_time;
        player.position.y += player.move_direction.y * globals.player_speed * globals.delta_time;
    }
}