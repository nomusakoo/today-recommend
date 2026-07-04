import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const API_KEY = process.env.SEOUL_API_KEY || "sample";
const IS_SAMPLE = API_KEY === "sample";
const PAGE_SIZE = IS_SAMPLE ? 5 : 1000;
const MAX_PAGES = IS_SAMPLE ? 1 : 5;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "data", "events.json");

function toDateOnly(raw) {
  if (!raw) return null;
  const d = raw.split(" ")[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
}

async function fetchPage(start, end) {
  const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${start}/${end}/`;
  const res = await fetch(url);
  const data = await res.json();
  const body = data.culturalEventInfo;

  if (!body || !body.row) {
    const message = body?.RESULT?.MESSAGE || data?.RESULT?.MESSAGE || JSON.stringify(data);
    throw new Error(`서울시 API 응답 오류: ${message}`);
  }

  return body.row;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const start = page * PAGE_SIZE + 1;
    const end = start + PAGE_SIZE - 1;
    const chunk = await fetchPage(start, end);
    rows.push(...chunk);
    if (chunk.length < PAGE_SIZE) break;
  }

  const items = rows
    .map((r) => ({
      title: r.TITLE?.trim() || "",
      category: r.CODENAME?.trim() || "기타",
      gu: r.GUNAME?.trim() || "",
      place: r.PLACE?.trim() || "",
      startDate: toDateOnly(r.STRTDATE),
      endDate: toDateOnly(r.END_DATE),
      isFree: r.IS_FREE === "무료",
      fee: r.USE_FEE?.trim() || "",
      target: r.USE_TRGT?.trim() || "",
      link: r.HMPG_ADDR || r.ORG_LINK || "",
      image: r.MAIN_IMG || "",
    }))
    .filter((item) => item.title && item.endDate && item.endDate >= today)
    .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));

  const output = {
    updatedAt: new Date().toISOString(),
    count: items.length,
    items: items.slice(0, 200),
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(
    `Fetched ${rows.length} rows, saved ${output.items.length} upcoming events to ${OUTPUT_PATH}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
