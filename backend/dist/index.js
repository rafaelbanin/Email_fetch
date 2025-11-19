"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cron_1 = require("./cron");
const gmail_1 = require("./gmail");
const emailStore_1 = require("./emailStore");
const emailStore_2 = require("./emailStore");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/emails/today", (req, res) => {
    res.json((0, emailStore_2.getPDFs)().map((p) => ({
        id: p.id,
        snippet: p.snippet,
        filename: p.filename,
    })));
});
app.post("/emails/update", async (req, res) => {
    try {
        const auth = await (0, gmail_1.loadOAuthClient)();
        const pdfs = await (0, gmail_1.fetchPDFsToday)(auth);
        (0, emailStore_1.savePDFs)(pdfs);
        console.log("PDFs atualizados:", pdfs.length);
        res.json({ ok: true, count: pdfs.length });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar PDFs" });
    }
});
app.get("/emails/pdf/:id", (req, res) => {
    const item = (0, emailStore_2.getPDFs)().find((p) => p.id === req.params.id);
    if (!item)
        return res.status(404).send("Not found");
    res.setHeader("Content-Type", "application/pdf");
    res.send(item.data);
});
app.listen(3001, () => console.log("Backend rodando em http://localhost:3001"));
(0, cron_1.startCron)();
