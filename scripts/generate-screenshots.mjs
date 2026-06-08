import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "../public/screenshots");

const mobileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844">
  <rect width="390" height="844" fill="#f9fafb"/>
  <!-- Nav -->
  <rect width="390" height="56" fill="#15803d"/>
  <text x="16" y="36" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="700">Bank of Mom</text>
  <text x="232" y="36" fill="rgba(255,255,255,0.8)" font-family="system-ui,-apple-system,sans-serif" font-size="14">Summary</text>
  <text x="300" y="36" fill="rgba(255,255,255,0.8)" font-family="system-ui,-apple-system,sans-serif" font-size="14">Transactions</text>
  <!-- Page title -->
  <text x="16" y="96" fill="#111827" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700">Account Summary</text>
  <!-- Balance card -->
  <rect x="16" y="112" width="358" height="116" rx="12" fill="#15803d"/>
  <text x="32" y="138" fill="#bbf7d0" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" letter-spacing="0.08em">CURRENT BALANCE</text>
  <text x="32" y="192" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="48" font-weight="700">$90.00</text>
  <!-- Interest this month -->
  <rect x="16" y="240" width="172" height="96" rx="12" fill="white"/>
  <text x="28" y="264" fill="#6b7280" font-family="system-ui,-apple-system,sans-serif" font-size="10" font-weight="600" letter-spacing="0.06em">INTEREST THIS MONTH</text>
  <text x="28" y="304" fill="#111827" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="700">$2.25</text>
  <text x="28" y="326" fill="#9ca3af" font-family="system-ui,-apple-system,sans-serif" font-size="11">Posts in 23 days</text>
  <!-- Total earned -->
  <rect x="202" y="240" width="172" height="96" rx="12" fill="white"/>
  <text x="214" y="264" fill="#6b7280" font-family="system-ui,-apple-system,sans-serif" font-size="10" font-weight="600" letter-spacing="0.06em">TOTAL INTEREST EARNED</text>
  <text x="214" y="304" fill="#111827" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="700">$1.25</text>
  <!-- Info card -->
  <rect x="16" y="350" width="358" height="64" rx="12" fill="white"/>
  <text x="28" y="378" fill="#4b5563" font-family="system-ui,-apple-system,sans-serif" font-size="13">Interest rate: $0.25 / month per $10</text>
  <text x="28" y="400" fill="#15803d" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="600">You earn $2.25 per month</text>
</svg>`;

const desktopSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800">
  <rect width="1280" height="800" fill="#f9fafb"/>
  <!-- Nav -->
  <rect width="1280" height="56" fill="#15803d"/>
  <text x="16" y="36" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="700">Bank of Mom</text>
  <text x="208" y="36" fill="rgba(255,255,255,0.9)" font-family="system-ui,-apple-system,sans-serif" font-size="14">Summary</text>
  <text x="284" y="36" fill="rgba(255,255,255,0.8)" font-family="system-ui,-apple-system,sans-serif" font-size="14">Transactions</text>
  <text x="376" y="36" fill="rgba(255,255,255,0.8)" font-family="system-ui,-apple-system,sans-serif" font-size="14">Manage</text>
  <!-- Centered content area -->
  <text x="240" y="112" fill="#111827" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700">Account Summary</text>
  <!-- Balance card -->
  <rect x="240" y="128" width="256" height="116" rx="12" fill="#15803d"/>
  <text x="256" y="154" fill="#bbf7d0" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" letter-spacing="0.08em">CURRENT BALANCE</text>
  <text x="256" y="208" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="48" font-weight="700">$90.00</text>
  <!-- Interest this month -->
  <rect x="512" y="128" width="256" height="116" rx="12" fill="white"/>
  <text x="528" y="154" fill="#6b7280" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" letter-spacing="0.06em">INTEREST THIS MONTH</text>
  <text x="528" y="208" fill="#111827" font-family="system-ui,-apple-system,sans-serif" font-size="48" font-weight="700">$2.25</text>
  <text x="528" y="232" fill="#9ca3af" font-family="system-ui,-apple-system,sans-serif" font-size="12">Posts in 23 days</text>
  <!-- Total earned -->
  <rect x="784" y="128" width="256" height="116" rx="12" fill="white"/>
  <text x="800" y="154" fill="#6b7280" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" letter-spacing="0.06em">TOTAL INTEREST EARNED</text>
  <text x="800" y="208" fill="#111827" font-family="system-ui,-apple-system,sans-serif" font-size="48" font-weight="700">$1.25</text>
  <!-- Info card -->
  <rect x="240" y="260" width="800" height="64" rx="12" fill="white"/>
  <text x="256" y="288" fill="#4b5563" font-family="system-ui,-apple-system,sans-serif" font-size="14">Interest rate: $0.25 / month per $10 · At your current balance, you earn</text>
  <text x="256" y="310" fill="#15803d" font-family="system-ui,-apple-system,sans-serif" font-size="14" font-weight="600">$2.25 per month</text>
</svg>`;

await sharp(Buffer.from(mobileSvg)).png().toFile(join(out, "mobile.png"));
console.log("✓ screenshots/mobile.png (390×844)");

await sharp(Buffer.from(desktopSvg)).png().toFile(join(out, "desktop.png"));
console.log("✓ screenshots/desktop.png (1280×800)");
