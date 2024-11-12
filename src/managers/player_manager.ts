import globals from "../core/globals"

export default function player_manager_handler_func() {
    for (const player_id in globals.players) {
        const player = globals.players[player_id];

        player.update();
    }
}