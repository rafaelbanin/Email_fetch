"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCron = startCron;
const node_cron_1 = __importDefault(require("node-cron"));
const gmail_1 = require("./gmail");
const emailStore_1 = require("./emailStore");
async function startCron() {
    const auth = await (0, gmail_1.loadOAuthClient)();
    // roda imediatamente ao iniciar
    const run = async () => {
        const pdfs = await (0, gmail_1.fetchPDFsToday)(auth);
        (0, emailStore_1.savePDFs)(pdfs);
        console.log("PDFs atualizados:", pdfs.length);
    };
    await run();
    // roda a cada 1 hora
    node_cron_1.default.schedule("0 * * * *", run);
}
