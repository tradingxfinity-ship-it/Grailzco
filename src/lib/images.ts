import { ACCEPTED_IMAGE_TYPES, LIMITS, MB } from "@/lib/submission";

/**
 * Browser-side photo preparation: validates the chosen file, then downsizes it
 * to a high-quality JPEG so several photos fit comfortably within email and
 * serverless upload limits.
 */
export async function prepareImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    throw new Error(`“${file.name}” isn't a JPG, PNG or WebP image.`);
  }
  if (file.size > LIMITS.maxSourceFileMB * MB) {
    throw new Error(`“${file.name}” is larger than ${LIMITS.maxSourceFileMB} MB.`);
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`“${file.name}” couldn't be read. Try exporting it as a JPG.`);
  }

  const scale = Math.min(1, LIMITS.resizeMaxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process this image.");
  ctx.fillStyle = "#ffffff"; // flatten transparency for JPEG
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const toJpeg = (q: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", q));

  for (const q of [0.86, 0.76, 0.64]) {
    const blob = await toJpeg(q);
    if (blob && blob.size <= LIMITS.maxUploadFileMB * MB) return { blob, width, height };
  }
  throw new Error(`“${file.name}” is too detailed to compress. Try a smaller photo.`);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}
