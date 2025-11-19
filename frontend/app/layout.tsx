export const metadata = {
  title: "Email Fetch",
  description: "Sistema de busca automática de PDFs por email",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
