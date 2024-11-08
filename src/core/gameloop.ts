import network_manager from "../managers/network_manager";
import player_manager from "../managers/player_manager";
import time_manager from "../managers/time_manager";

export default function gameloop() {
    network_manager();
    player_manager();
    time_manager();
}