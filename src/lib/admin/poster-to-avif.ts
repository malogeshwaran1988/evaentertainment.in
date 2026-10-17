/**
 * Browser AVIF encoder for admin project posters.
 * Adapted from TemplatePix image-to-avif (target-size mode). Swap for an npm
 * package later without changing PosterField’s call site.
 */

export const POSTER_AVIF_MAX_KB = 149;
export const POSTER_AVIF_MIN_KB = 100;
export const POSTER_AVIF_MAX_BYTES = POSTER_AVIF_MAX_KB * 1024;
export const POSTER_AVIF_MIN_BYTES = POSTER_AVIF_MIN_KB * 1024;

export const POSTER_SOURCE_MAX_BYTES = 25 * 1024 * 1024;
/** Long-side cap before AVIF encode; larger sources are downscaled automatically. */
export const POSTER_SOURCE_MAX_DIMENSION = 2400;

/** Stop filling once output reaches the preferred min share of the max. */
const TARGET_FILL_RATIO = POSTER_AVIF_MIN_KB / POSTER_AVIF_MAX_KB;

const TARGET_QUALITY_MIN = 5;
const TARGET_QUALITY_MAX = 90;
const TARGET_MAX_ENCODES_PER_ROUND = 7;
const TARGET_MAX_ROUNDS = 16;
const TARGET_MIN_LONG_SIDE = 64;
const TARGET_FILL_ENCODES = 3;
const TARGET_STEP_BACK_RATIO = 0.7;
const TARGET_STEP_BACK_SCALE = 1.1;
const TARGET_PROBE_SPEED = 10;

export const POSTER_SOURCE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
]);

export const POSTER_SOURCE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif";

function isAcceptedFile(file: File): boolean {
  if (POSTER_SOURCE_TYPES.has(file.type)) return true;
  return /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name);
}

export function validatePosterSource(file: File): string | null {
  if (!isAcceptedFile(file)) {
    return "Choose a JPG, PNG, WebP, GIF, BMP or AVIF image.";
  }
  if (file.size > POSTER_SOURCE_MAX_BYTES) {
    return `File is too large (max ${Math.round(POSTER_SOURCE_MAX_BYTES / (1024 * 1024))} MB).`;
  }
  return null;
}

export function toAvifFilename(filename: string): string {
  const leaf = filename.split(/[/\\]/).pop()?.trim() || "poster";
  const withoutExt = leaf.replace(
    /(\.(jpe?g|png|webp|gif|bmp|heic|heif|tiff?|avif))+$/i,
    "",
  );
  const slug = withoutExt
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "poster"}.avif`;
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  const full = await createImageBitmap(file);
  const longSide = Math.max(full.width, full.height);
  if (longSide <= POSTER_SOURCE_MAX_DIMENSION) {
    return full;
  }

  const scale = POSTER_SOURCE_MAX_DIMENSION / longSide;
  const resizeWidth = Math.max(1, Math.round(full.width * scale));
  const resizeHeight = Math.max(1, Math.round(full.height * scale));
  full.close();

  return createImageBitmap(file, {
    resizeWidth,
    resizeHeight,
    resizeQuality: "high",
  });
}

function bitmapToImageData(
  bitmap: ImageBitmap,
  width: number,
  height: number,
): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Could not read image pixels in this browser.");
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

let encodePromise: Promise<typeof import("@jsquash/avif").encode> | null = null;

async function getEncode() {
  if (!encodePromise) {
    encodePromise = import("@jsquash/avif").then((mod) => mod.encode);
  }
  return encodePromise;
}

interface EncodedCandidate {
  buffer: ArrayBuffer;
  quality: number;
  width: number;
  height: number;
}

interface QualitySearchResult {
  best: EncodedCandidate | null;
  smallest: EncodedCandidate;
  failQuality: number;
}

async function searchQuality(
  imageData: ImageData,
  targetBytes: number,
): Promise<QualitySearchResult> {
  const encode = await getEncode();
  const { width, height } = imageData;
  let lo = TARGET_QUALITY_MIN;
  let hi = TARGET_QUALITY_MAX;
  let best: EncodedCandidate | null = null;
  let smallest: EncodedCandidate | null = null;
  let failQuality = TARGET_QUALITY_MAX + 1;

  const tryQuality = async (quality: number) => {
    const buffer = await encode(imageData, { quality, speed: TARGET_PROBE_SPEED });
    const candidate = { buffer, quality, width, height };
    if (!smallest || buffer.byteLength < smallest.buffer.byteLength) {
      smallest = candidate;
    }
    return candidate;
  };

  for (let i = 0; i < TARGET_MAX_ENCODES_PER_ROUND && lo <= hi; i++) {
    const quality = Math.round((lo + hi) / 2);
    const candidate = await tryQuality(quality);
    if (candidate.buffer.byteLength <= targetBytes) {
      best = candidate;
      if (candidate.buffer.byteLength >= targetBytes * TARGET_FILL_RATIO) break;
      lo = quality + 1;
    } else {
      failQuality = Math.min(failQuality, quality);
      hi = quality - 1;
    }
  }

  if (!best && smallest!.quality > TARGET_QUALITY_MIN) {
    const floor = await tryQuality(TARGET_QUALITY_MIN);
    if (floor.buffer.byteLength <= targetBytes) best = floor;
  }

  return { best, smallest: smallest!, failQuality };
}

function scaledSize(width: number, height: number, scale: number) {
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function fillToTarget(
  imageData: ImageData,
  probe: EncodedCandidate,
  failQuality: number,
  targetBytes: number,
): Promise<EncodedCandidate> {
  const encode = await getEncode();
  let chosen = probe;

  const first = await encode(imageData, { quality: probe.quality });
  if (first.byteLength <= targetBytes) chosen = { ...probe, buffer: first };
  if (chosen.buffer.byteLength >= targetBytes * TARGET_FILL_RATIO) return chosen;

  let lo = probe.quality + 1;
  let hi = Math.min(TARGET_QUALITY_MAX, failQuality);
  for (let i = 0; i < TARGET_FILL_ENCODES && lo <= hi; i++) {
    const quality = Math.round((lo + hi) / 2);
    const buffer = await encode(imageData, { quality });
    if (buffer.byteLength <= targetBytes) {
      chosen = { ...probe, quality, buffer };
      if (buffer.byteLength >= targetBytes * TARGET_FILL_RATIO) break;
      lo = quality + 1;
    } else {
      hi = quality - 1;
    }
  }

  return chosen;
}

async function fitAtSize(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  targetBytes: number,
): Promise<{ candidate: EncodedCandidate | null; floorBytes: number }> {
  const imageData = bitmapToImageData(bitmap, width, height);
  const isFullSize = width === bitmap.width && height === bitmap.height;

  if (!isFullSize) {
    const encode = await getEncode();
    const floorBuffer = await encode(imageData, {
      quality: TARGET_QUALITY_MIN,
      speed: TARGET_PROBE_SPEED,
    });
    if (floorBuffer.byteLength > targetBytes) {
      return { candidate: null, floorBytes: floorBuffer.byteLength };
    }
  }

  const search = await searchQuality(imageData, targetBytes);
  if (!search.best) {
    return { candidate: null, floorBytes: search.smallest.buffer.byteLength };
  }
  const candidate = await fillToTarget(
    imageData,
    search.best,
    search.failQuality,
    targetBytes,
  );
  return { candidate, floorBytes: search.smallest.buffer.byteLength };
}

async function stepBackUp(
  bitmap: ImageBitmap,
  candidate: EncodedCandidate,
  targetBytes: number,
): Promise<EncodedCandidate> {
  if (candidate.buffer.byteLength >= targetBytes * TARGET_STEP_BACK_RATIO) {
    return candidate;
  }
  const scale = Math.min(
    TARGET_STEP_BACK_SCALE,
    bitmap.width / candidate.width,
    bitmap.height / candidate.height,
  );
  if (scale <= 1) return candidate;
  const up = scaledSize(candidate.width, candidate.height, scale);
  const larger = await fitAtSize(bitmap, up.width, up.height, targetBytes);
  return larger.candidate ?? candidate;
}

async function encodeToTarget(
  bitmap: ImageBitmap,
  targetBytes: number,
): Promise<EncodedCandidate> {
  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  const full = await fitAtSize(bitmap, sourceWidth, sourceHeight, targetBytes);
  if (full.candidate) return full.candidate;

  let width = sourceWidth;
  let height = sourceHeight;
  let floorBytes = full.floorBytes;

  for (let round = 0; round < TARGET_MAX_ROUNDS; round++) {
    const ratio = Math.sqrt(targetBytes / floorBytes) * 0.9;
    let next = scaledSize(width, height, Math.min(0.9, Math.max(0.5, ratio)));
    const atFloor = Math.max(next.width, next.height) <= TARGET_MIN_LONG_SIDE;
    if (atFloor) {
      next = scaledSize(
        sourceWidth,
        sourceHeight,
        TARGET_MIN_LONG_SIDE / Math.max(sourceWidth, sourceHeight),
      );
    }
    width = next.width;
    height = next.height;

    const fitted = await fitAtSize(bitmap, width, height, targetBytes);
    if (fitted.candidate) {
      return stepBackUp(bitmap, fitted.candidate, targetBytes);
    }
    floorBytes = fitted.floorBytes;
    if (atFloor) break;
  }

  throw new Error(
    `Could not fit this image within ${POSTER_AVIF_MAX_KB} KB. Try a simpler or smaller image.`,
  );
}

export type PosterAvifResult = {
  file: File;
  bytes: number;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  resized: boolean;
  passedThrough: boolean;
};

function isAvifFile(file: File): boolean {
  return file.type === "image/avif" || /\.avif$/i.test(file.name);
}

/**
 * Convert any accepted source image to AVIF under 149 KB, filling quality
 * toward ≥100 KB when possible. Already-good AVIF files pass through.
 */
export async function convertPosterToAvif(file: File): Promise<PosterAvifResult> {
  const validationError = validatePosterSource(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (
    isAvifFile(file) &&
    file.size <= POSTER_AVIF_MAX_BYTES &&
    file.size >= POSTER_AVIF_MIN_BYTES
  ) {
    const bitmap = await loadBitmap(file);
    const { width, height } = bitmap;
    bitmap.close();
    const named =
      file.name.toLowerCase().endsWith(".avif")
        ? file
        : new File([file], toAvifFilename(file.name), { type: "image/avif" });
    return {
      file: named,
      bytes: named.size,
      width,
      height,
      sourceWidth: width,
      sourceHeight: height,
      resized: false,
      passedThrough: true,
    };
  }

  const bitmap = await loadBitmap(file);
  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  let candidate: EncodedCandidate;

  try {
    candidate = await encodeToTarget(bitmap, POSTER_AVIF_MAX_BYTES);
    if (candidate.buffer.byteLength > POSTER_AVIF_MAX_BYTES) {
      throw new Error(
        `Could not fit this image within ${POSTER_AVIF_MAX_KB} KB. Try a simpler or smaller image.`,
      );
    }
  } finally {
    bitmap.close();
  }

  const fileOut = new File([candidate.buffer], toAvifFilename(file.name), {
    type: "image/avif",
  });

  return {
    file: fileOut,
    bytes: fileOut.size,
    width: candidate.width,
    height: candidate.height,
    sourceWidth,
    sourceHeight,
    resized: candidate.width !== sourceWidth || candidate.height !== sourceHeight,
    passedThrough: false,
  };
}
