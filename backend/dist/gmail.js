"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOAuthClient = loadOAuthClient;
exports.fetchPDFsToday = fetchPDFsToday;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
const TOKEN_PATH = path_1.default.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path_1.default.join(process.cwd(), "credentials.json");
async function loadOAuthClient() {
    const creds = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, "utf8"));
    const { client_secret, client_id, redirect_uris } = creds.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    if (fs_1.default.existsSync(TOKEN_PATH)) {
        oAuth2Client.setCredentials(JSON.parse(fs_1.default.readFileSync(TOKEN_PATH, "utf8")));
        return oAuth2Client;
    }
    // fluxo inicial (usuário precisa acessar link)
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    });
    console.log("Authorize this app by visiting:", authUrl);
    throw new Error("OAuth token missing. Run OAuth authorization first.");
}
async function fetchPDFsToday(auth) {
    const gmail = googleapis_1.google.gmail({ version: "v1", auth });
    const today = new Date();
    const query = `newer_than:1d filename:pdf`;
    const res = await gmail.users.messages.list({
        userId: "me",
        q: query,
    });
    if (!res.data.messages)
        return [];
    const pdfs = [];
    for (const msg of res.data.messages) {
        const full = await gmail.users.messages.get({
            userId: "me",
            id: msg.id,
        });
        const parts = full.data.payload?.parts || [];
        for (const part of parts) {
            if (part.filename && part.filename.endsWith(".pdf")) {
                const attachment = await gmail.users.messages.attachments.get({
                    userId: "me",
                    messageId: msg.id,
                    id: part.body?.attachmentId,
                });
                const data = Buffer.from(attachment.data.data, "base64");
                pdfs.push({
                    id: msg.id,
                    snippet: full.data.snippet || "",
                    filename: part.filename,
                    data,
                });
            }
        }
    }
    return pdfs;
}
