export interface EmailPDF {
  id: string;
  snippet: string;
  filename: string;
  data: Buffer;
}

let pdfs: EmailPDF[] = [];

export function savePDFs(items: EmailPDF[]) {
  pdfs = items;
}

export function getPDFs() {
  return pdfs;
}
