"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
async function main() {
    const CREDENTIALS_PATH = path_1.default.join(process.cwd(), "credentials.json");
    const TOKEN_PATH = path_1.default.join(process.cwd(), "token.json");
    const creds = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, "utf8"));
    const { client_secret, client_id, redirect_uris } = creds.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const code = process.argv[2];
    if (!code) {
        console.log("Use: node dist/get-token.js <CODE>");
        return;
    }
    const { tokens } = await oAuth2Client.getToken(code);
    fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log("token.json salvo com sucesso!");
}
main();
