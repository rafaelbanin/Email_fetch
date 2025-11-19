import cron from "node-cron";
import { loadOAuthClient, fetchPDFsToday } from "./gmail";
import { savePDFs } from "./emailStore";

export async function startCron() {
  const auth = await loadOAuthClient();

  // roda imediatamente ao iniciar
  const run = async () => {
    const pdfs = await fetchPDFsToday(auth);
    savePDFs(pdfs);
    console.log("PDFs atualizados:", pdfs.length);
  };

  await run();

  // roda a cada 1 hora
  cron.schedule("0 * * * *", run);
}
