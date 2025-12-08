import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for userId:", metadata);
    console.log("file url", file.url);
    return { uploadedBy: "user" };
  }),
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Product Image Upload complete", file.url);
    return { uploadedBy: "admin" };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
