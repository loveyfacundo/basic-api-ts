"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const express_api_reference_1 = require("@scalar/express-api-reference");
const port = Number(process.env.PORT ?? 3000);
const currentDirectory = __dirname;
const openApiPath = node_path_1.default.resolve(currentDirectory, "../openapi.json");
const openApiDocument = JSON.parse((0, node_fs_1.readFileSync)(openApiPath, "utf8"));
const app = (0, express_1.default)();
const simulatedDelayMs = 4000;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
app.get("/openapi.json", (_request, response) => {
    response.json(openApiDocument);
});
app.use("/reference", (0, express_api_reference_1.apiReference)({ spec: { url: "/openapi.json" } }));
app.get("/api/time", async (_request, response) => {
    await wait(simulatedDelayMs);
    const now = new Date();
    response.json({
        time: now.toISOString(),
        unixTimestamp: now.getTime(),
        simulatedDelayMs
    });
});
app.get("/api/health", async (_request, response) => {
    await wait(simulatedDelayMs);
    response.json({
        status: "healthy",
        service: "basic-api-ts",
        uptimeSeconds: Math.floor(process.uptime()),
        checkedAt: new Date().toISOString(),
        simulatedDelayMs
    });
});
app.get("/health", (_request, response) => {
    response.json({ status: "healthy" });
});
app.get("/info", (_request, response) => {
    response.json({
        app: "basic-api-ts",
        version: "2.0",
        containerized: true
    });
});
app.get("/", (_request, response) => {
    response.json({
        message: "Hola desde un contenedor",
        hostname: node_os_1.default.hostname(),
        node: process.version
    });
});
app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on port ${port}`);
});
