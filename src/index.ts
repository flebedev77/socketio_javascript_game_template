//@ts-ignore
import express from "express";
import * as logger from "./logger";
import config from "./config";
import { Server } from "socket.io";
import * as net_handler from "./core/net_handler";
import globals from "./core/globals";
import gameloop from "./core/gameloop";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(config.public_serve_path));

const server = app.listen(PORT, "0.0.0.0", logger.log_info(`Server listening on port ${PORT}`));

//@ts-ignore
globals.io = new Server(server, {
    cors: {
        origin: "*"
    }
});

net_handler.init_network();

//@ts-ignore
globals.io.on("connection", (socket) => {
    socket.join(socket.id);
    logger.log_info(`Socket connected with id ${socket.id}`);

    net_handler.handle_connection(socket);

    socket.on("disconnect", () => {
        logger.log_info(`Socket disconnected with id ${socket.id}`);
    })
})

function loop() {
    gameloop();
    setTimeout(loop, globals.update_speed);
}

loop();