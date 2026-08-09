import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request) {
    let formData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const file = formData.get("file");

    if (!file || typeof file === "string") {
        return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ message: "Unsupported file type. Use PNG, JPG, WEBP, or GIF." }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ message: "File is too large. Maximum size is 5MB." }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const extension = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const filename = `${crypto.randomUUID()}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
}
