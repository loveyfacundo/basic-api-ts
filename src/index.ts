import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { apiReference } from "@scalar/express-api-reference";

const port = Number(process.env.PORT ?? 3000);
const currentDirectory = __dirname;
const openApiPath = path.resolve(currentDirectory, "../openapi.json");
const openApiDocument = JSON.parse(readFileSync(openApiPath, "utf8"));
const app = express();
const simulatedDelayMs = 4000;

const wait = (milliseconds: number) =>
new Promise((resolve) => setTimeout(resolve, milliseconds));

app.get("/openapi.json", (_request, response) => {
response.json(openApiDocument);
});

app.use("/reference", apiReference({ spec: { url: "/openapi.json" } }));

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
	hostname: os.hostname(),
	node: process.version
});
});

app.listen(port, "0.0.0.0", () => {
console.log(`API listening on port ${port}`);
});