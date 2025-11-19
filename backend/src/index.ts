import express from "express";
import cors from "cors";
import { startCron } from "./cron";
import { loadOAuthClient, fetchPDFsToday } from "./gmail";
import { savePDFs } from "./emailStore";
import { getPDFs } from "./emailStore";

const app = express();
app.use(cors());

app.get("/emails/today", (req, res) => {
  res.json(
    getPDFs().map((p) => ({
      id: p.id,
      snippet: p.snippet,
      filename: p.filename,
    }))
  );
});

app.post("/emails/update", async (req, res) => {
  try {
    const auth = await loadOAuthClient();
    const pdfs = await fetchPDFsToday(auth);
    savePDFs(pdfs);

    console.log("PDFs atualizados:", pdfs.length);

    res.json({ ok: true, count: pdfs.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar PDFs" });
  }
});

app.get("/emails/pdf/:id", (req, res) => {
  const item = getPDFs().find((p) => p.id === req.params.id);
  if (!item) return res.status(404).send("Not found");

  res.setHeader("Content-Type", "application/pdf");
  res.send(item.data);
});

app.listen(3001, () => console.log("Backend rodando em http://localhost:3001"));

startCron();
