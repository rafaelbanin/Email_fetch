import fs from "fs";
import path from "path";
import { google } from "googleapis";

async function main() {
  const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
  const TOKEN_PATH = path.join(process.cwd(), "token.json");

  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = creds.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const code = process.argv[2];
  if (!code) {
    console.log("Use: node dist/get-token.js <CODE>");
    return;
  }

  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

  console.log("token.json salvo com sucesso!");
}

main();
