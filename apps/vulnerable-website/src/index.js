
import dotenv from "dotenv";

async function load() {
  dotenv.config();

  await import("./app.js");
}

load();
