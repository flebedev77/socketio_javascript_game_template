//@ts-ignore
import express from "express";
import * as logger from "./logger";
import config from "./config";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(config.public_serve_path));

const server = app.listen(PORT, logger.log_info(`Server listening on port ${PORT}`));

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


io.on("connection", (socket) => {
    logger.log_info(`Socket connected with id ${socket.id}`);

    socket.on("disconnect", () => {
        logger.log_info(`Socket disconnected with id ${socket.id}`);
    })
})