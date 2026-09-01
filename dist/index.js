"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const node_os_1 = __importDefault(require("node:os"));
const port = Number(process.env.PORT ?? 3000);
const server = (0, node_http_1.createServer)((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/health") {
        res.end(JSON.stringify({ status: "healthy" }));
        return;
    }
    if (req.url === "/info") {
        res.end(JSON.stringify({
            app: "container-demo",
            version: "2.0",
            containerized: true
        }));
        return;
    }
    res.end(JSON.stringify({
        message: "Hola desde un contenedor",
        hostname: node_os_1.default.hostname(),
        node: process.version
    }));
});
server.listen(port, "0.0.0.0");
