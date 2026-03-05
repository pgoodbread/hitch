import { createUploadthing, type FileRouter } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: '8MB', maxFileCount: 10 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl, key: file.key }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
