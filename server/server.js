const express = require("express");
const path = require("path");

const app = express();

const PORT = 8080;

function getFilePath(file) {
  const filePath = path.join(__dirname, file);
  return filePath;
}

function fileAsResponse(res, filePath) {
  res.sendFile(filePath);
}

app.get("/", async (_, res) => {
  fileAsResponse(res, getFilePath("../index.html"));
});

app.get("/index.js", async (_, res) => {
  fileAsResponse(res, getFilePath("../index.js"));
});

app.get("/snake.js", async (_, res) => {
  fileAsResponse(res, getFilePath("../snake.js"));
});

app.get("/constants.js", async (_, res) => {
  fileAsResponse(res, getFilePath("../constants.js"));
});

app.get("/utils.js", async (_, res) => {
  fileAsResponse(res, getFilePath("../utils.js"));
});

app.get("/gameLogic.js", async (_, res) => {
  fileAsResponse(res, getFilePath("../gameLogic.js"));
});

app.get("/domManipulation.js", async (_, res) => {
  fileAsResponse(res, getFilePath("../domManipulation.js"));
});

app.get("/style.css", async (_, res) => {
  fileAsResponse(res, getFilePath("../style.css"));
});

app.listen(PORT, () => {
  console.log("listen on " + PORT);
});
