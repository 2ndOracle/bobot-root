import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOBOT",
  description:
    "Играю со шрифтами в интернете и иногда делаю полезные проекты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
