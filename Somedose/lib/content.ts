import fs from "fs";
import path from "path";
const DATA_PATH = path.join(process.cwd(), "content", "data.json");
export function getContent() { return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")); }
export function saveContent(data: unknown) { fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8"); }
