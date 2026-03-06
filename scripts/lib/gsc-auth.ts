import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'
import type { JWT } from 'google-auth-library'

const CREDENTIALS_PATH = path.join(process.cwd(), '.gsc-credentials.json')
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']

export async function authenticate(): Promise<JWT> {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(
      '\nMissing .gsc-credentials.json in project root.\n\n' +
        'Setup steps:\n' +
        '  1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts\n' +
        '  2. Create a service account key (JSON type)\n' +
        '  3. Save it as .gsc-credentials.json in the project root\n' +
        '  4. Add the service account email as a user in Google Search Console\n',
    )
    process.exit(1)
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  })

  const client = (await auth.getClient()) as JWT
  console.log('Authenticated via service account')
  return client
}
