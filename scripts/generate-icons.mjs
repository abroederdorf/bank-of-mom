import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = join(__dirname, "../public/icon-source.png");

// Android
await sharp(source).resize(192, 192).png().toFile(join(__dirname, "../public/icon-192.png"));
console.log("✓ icon-192.png (Android)");

await sharp(source).resize(512, 512).png().toFile(join(__dirname, "../public/icon-512.png"));
console.log("✓ icon-512.png (Android maskable)");

// iOS
await sharp(source).resize(180, 180).png().toFile(join(__dirname, "../public/apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png (iOS 180px)");

await sharp(source).resize(152, 152).png().toFile(join(__dirname, "../public/apple-touch-icon-152.png"));
console.log("✓ apple-touch-icon-152.png (iPad)");
