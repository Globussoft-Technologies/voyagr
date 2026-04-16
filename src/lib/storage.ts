import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIMETYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export async function uploadFile(
  file: File,
  tenantSlug: string,
): Promise<{ filename: string; url: string; size: number; mimeType: string }> {
  if (file.size > MAX_SIZE) {
    throw new StorageError("File exceeds maximum size of 10 MB");
  }

  if (!ALLOWED_MIMETYPES.has(file.type)) {
    throw new StorageError(
      "Invalid file type. Allowed: jpeg, png, gif, webp, svg",
    );
  }

  const ext = extensionFromMime(file.type);
  const uuid = crypto.randomUUID();
  const filename = `${uuid}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", tenantSlug);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const url = `/uploads/${tenantSlug}/${filename}`;

  return { filename, url, size: file.size, mimeType: file.type };
}

export async function deleteFile(url: string): Promise<void> {
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch {
    // File may already be gone — ignore
  }
}

function extensionFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}
