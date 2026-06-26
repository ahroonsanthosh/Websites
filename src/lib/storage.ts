import fsp from "fs/promises";
import path from "path";

/**
 * Storage abstraction for content (JSON) and media (images).
 *
 * - Local development / writable hosts: reads & writes the filesystem
 *   (`/content/*.json` and `/public/uploads/*`).
 * - Production on a read-only host (e.g. Vercel): if `BLOB_READ_WRITE_TOKEN`
 *   is set, persists to Vercel Blob instead, so CMS edits survive.
 *
 * Reads always fall back to the bundled JSON files shipped with the repo, so a
 * fresh deploy shows the seed content until the owner edits something.
 */

const contentDir = path.join(process.cwd(), "content");
const uploadsDir = path.join(process.cwd(), "public", "uploads");

function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// ---------------------------------------------------------------- JSON content

export async function readJSON<T>(name: string): Promise<T> {
  if (blobEnabled()) {
    try {
      const { head } = await import("@vercel/blob");
      const meta = await head(`content/${name}.json`);
      const res = await fetch(meta.url, { cache: "no-store" });
      if (res.ok) return (await res.json()) as T;
    } catch {
      // Not yet written to Blob (or lookup failed) — fall back to bundled file.
    }
  }

  const raw = await fsp.readFile(path.join(contentDir, `${name}.json`), "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJSON(name: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    await put(`content/${name}.json`, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await fsp.writeFile(path.join(contentDir, `${name}.json`), json, "utf-8");
}

// ---------------------------------------------------------------------- media

/** Saves an uploaded image and returns the URL to reference it by. */
export async function saveMedia(
  filename: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, data, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
    return blob.url;
  }

  await fsp.writeFile(path.join(uploadsDir, filename), data);
  return `/uploads/${filename}`;
}

/** Deletes an uploaded image. Accepts a Blob URL or a local `/uploads/...` path. */
export async function deleteMedia(ref: string): Promise<void> {
  if (blobEnabled() && ref.startsWith("http")) {
    const { del } = await import("@vercel/blob");
    await del(ref);
    return;
  }

  const safe = path.basename(ref);
  await fsp.unlink(path.join(uploadsDir, safe)).catch(() => {});
}
