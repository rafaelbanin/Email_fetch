"use client";

import { useEffect, useState } from "react";

interface EmailItem {
  id: string;
  snippet: string;
  filename: string;
}

export default function Home() {
  const [pdfs, setPdfs] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/emails/today");
      const data = await response.json();
      setPdfs(data);
      setLastUpdate(new Date().toLocaleString("pt-BR"));
    } catch (error) {
      console.error("Erro ao buscar PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

   const updatePDFs = async () => {
    try {
      setLoading(true);

      await fetch("http://localhost:3001/emails/update", {
        method: "POST",
      });

      // depois que atualizar no backend, pega a lista novamente
      await fetchPDFs();
    } catch (error) {
      console.error("Erro ao atualizar PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFs(); // ao carregar

    // atualização automática a cada 1h
    const interval = setInterval(() => {
      fetchPDFs();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>📧 Busca de PDFs no Gmail</h1>

     <div className="mt-4 space-x-4">
          <button
            onClick={fetchPDFs}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Recarregar Página
          </button>

          <button
            onClick={updatePDFs}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Atualizando..." : "Buscar PDFs no Gmail"}
          </button>
        </div>

      <ul style={{ marginTop: "30px", padding: 0, listStyle: "none" }}>
        {pdfs.length === 0 && !loading && (
          <p style={{ textAlign: "center", color: "#444" }}>
            Nenhum PDF encontrado hoje.
          </p>
        )}

        {pdfs.map((item) => (
          <li
            key={item.id}
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "15px",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <p>
              <strong>Assunto:</strong> {item.snippet}
            </p>
            <p>
              <strong>Arquivo:</strong> {item.filename}
            </p>

            <a
              href={`http://localhost:3001/emails/pdf/${item.id}`}
              target="_blank"
              style={{
                color: "#0070f3",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              📄 Baixar PDF
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
