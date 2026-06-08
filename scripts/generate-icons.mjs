import sharp from "sharp";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

// Find the source image — prefer the Gemini/AI-generated file if present
const sourceFile = readdirSync(publicDir).find(f =>
  f.match(/Gemini_Generated/i) || f === "icon-source.png"
) ?? "icon.svg";

const source = join(publicDir, sourceFile);
console.log(`Using source: ${sourceFile}`);

await sharp(source).resize(192, 192).png().toFile(join(publicDir, "icon-192.png"));
console.log("✓ icon-192.png");

await sharp(source).resize(512, 512).png().toFile(join(publicDir, "icon-512.png"));
console.log("✓ icon-512.png");

await sharp(source).resize(180, 180).png().toFile(join(publicDir, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");
