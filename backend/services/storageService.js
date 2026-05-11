import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "uploads";

const ensureConfig = () => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars are not configured");
  }
};

const getClient = () => {
  ensureConfig();
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

const buildPublicId = (folder) => {
  const base = crypto.randomBytes(12).toString("hex");
  const cleanFolder = folder ? folder.replace(/\/+$/, "") : CLOUDINARY_FOLDER;
  const name = `${Date.now()}-${base}`;
  return `${cleanFolder}/${name}`;
};

export const uploadBufferToCloudinary = async ({ buffer, folder }) => {
  const client = getClient();
  const publicId = buildPublicId(folder);

  const result = await new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "auto",
      },
      (error, uploaded) => {
        if (error) return reject(error);
        return resolve(uploaded);
      }
    );

    stream.end(buffer);
  });

  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteFromCloudinary = async (publicId) => {
  const client = getClient();
  const attempts = ["image", "raw", "video"];

  for (const resourceType of attempts) {
    const result = await client.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result?.result === "ok" || result?.result === "not found") {
      return result;
    }
  }
};

export const isCloudinaryUrl = (value) => {
  if (!value) return false;
  return value.includes("res.cloudinary.com");
};

export const extractPublicId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const uploadIndex = parsed.pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    let rest = parsed.pathname.slice(uploadIndex + "/upload/".length);
    rest = rest.replace(/^v\d+\//, "");
    const withoutExt = rest.replace(/\.[^/.]+$/, "");
    return withoutExt;
  } catch {
    return null;
  }
};