const express = require("express");
const path = require("path");

const app = express();

const PORT = 8080;

function getFilePath(file) {
  const filePath = path.join(__dirname, file);
  return filePath;
}

app.get("/", async (_, res) => {
  res.sendFile(getFilePath("../index.html"));
});

app.get("/index.js", async (_, res) => {
  res.sendFile(getFilePath("../index.js"));
});

app.get("/snake.js", async (_, res) => {
  res.sendFile(getFilePath("../snake.js"));
});

app.get("/style.css", async (_, res) => {
  res.sendFile(getFilePath("../style.css"));
});

app.listen(PORT, () => {
  console.log("listen on " + PORT);
});
