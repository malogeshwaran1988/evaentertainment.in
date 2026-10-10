// Converts every image in public/images to AVIF under 150 KB and builds the
// 1200x630 JPG social preview images. Usage: npm run images
import { existsSync } from "node:fs";
import { readdir, stat, unlink, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "../public/images");
const MAX_BYTES = 150 * 1024;
const MAX_WIDTH = 1920;
const SKIP_DIRS = new Set(["our-projects", "og"]);
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Social previews stay JPG: Facebook, X, LinkedIn and WhatsApp don't read AVIF. */
const OG_IMAGES = {
  home: "home/slide-1",
  about: "about/about-1",
  services: "services/equipment-01",
  projects: "services/equipment-03",
  equipment: "equipment/equipment-06",
  contact: "services/equipment-02",
  book: "home/slide-2",
  "dubbing-studio-mumbai": "services/equipment-01",
  "voice-over-studio-mumbai": "services/equipment-02",
  "foley-recording-mumbai": "services/equipment-03",
  "5-1-mixing-studio-mumbai": "services/equipment-04",
  "subtitling-services-mumbai": "services/equipment-05",
  "song-recording-studio-mumbai": "home/slide-2",
  "translation-services-mumbai": "services/equipment-05",
  "stock-music-library": "home/services-grid-5",
};

async function encodeUnder(pipeline, encode, qualities) {
  for (const quality of qualities) {
    const buffer = await encode(pipeline.clone(), quality);
    if (buffer.length < MAX_BYTES) return { buffer, quality };
  }
  throw new Error("could not get under 150 KB");
}

function findSource(base) {
  for (const ext of [".jpg", ".jpeg", ".png", ".webp", ".avif"]) {
    const file = path.join(ROOT, base + ext);
    if (existsSync(file)) return file;
  }
  throw new Error(`no source image for ${base}`);
}

async function buildSocialImages() {
  const outDir = path.join(ROOT, "og");
  await mkdir(outDir, { recursive: true });
  for (const [name, base] of Object.entries(OG_IMAGES)) {
    const pipeline = sharp(findSource(base)).resize(1200, 630, { fit: "cover" });
    const { buffer, quality } = await encodeUnder(
      pipeline,
      (p, q) => p.jpeg({ quality: q, mozjpeg: true }).toBuffer(),
      [82, 76, 70, 64, 58, 52],
    );
    await writeFile(path.join(outDir, `${name}.jpg`), buffer);
    console.log(`og/${name}.jpg`.padEnd(36), `${Math.round(buffer.length / 1024)} KB  q${quality}`);
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
    } else {
      yield path.join(dir, entry.name);
    }
  }
}

async function convertToAvif() {
  for await (const file of walk(ROOT)) {
    if (!SOURCE_EXT.has(path.extname(file).toLowerCase())) continue;
    const out = file.replace(/\.\w+$/, ".avif");
    const { width = MAX_WIDTH } = await sharp(file).metadata();
    const pipeline = sharp(file).resize({ width: Math.min(width, MAX_WIDTH) });
    const { buffer, quality } = await encodeUnder(
      pipeline,
      (p, q) => p.avif({ quality: q, effort: 6 }).toBuffer(),
      [60, 55, 50, 45, 40, 35, 30],
    );
    await writeFile(out, buffer);
    const before = (await stat(file)).size;
    await unlink(file);
    console.log(
      path.relative(ROOT, out).padEnd(36),
      `${Math.round(before / 1024)} KB -> ${Math.round(buffer.length / 1024)} KB  q${quality}`,
    );
  }
}

/** Pre-blurred, darkened section backgrounds, so the browser never runs a live blur filter. */
const BLURRED_BACKGROUNDS = {
  "home/projects-bg": "services/equipment-04",
};

async function buildBlurredBackgrounds() {
  for (const [name, base] of Object.entries(BLURRED_BACKGROUNDS)) {
    const buffer = await sharp(findSource(base))
      .resize({ width: 1600 })
      .blur(14)
      .modulate({ brightness: 0.6, saturation: 0.85 })
      .avif({ quality: 40, effort: 6 })
      .toBuffer();
    await writeFile(path.join(ROOT, `${name}.avif`), buffer);
    console.log(`${name}.avif`.padEnd(36), `${Math.round(buffer.length / 1024)} KB`);
  }
}

await buildSocialImages();
await convertToAvif();
await buildBlurredBackgrounds();
