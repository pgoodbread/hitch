import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export async function deleteUploadedFiles(keys: string[]): Promise<void> {
  if (keys.length === 0) return
  await utapi.deleteFiles(keys)
}
