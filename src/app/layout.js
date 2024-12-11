import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PEMIRA PMK FSM UNDIP",
  description:
    "Pemilihan Raya Persatuan Mahasiswa Katolik Fakultas Sains dan Matematika Universitas Diponegoro.",
  icons: {
    icon: "/logo.png", // Favicon utama
    shortcut: "//logo.png", // Shortcut icon
    apple: "//logo.png", // Ikon khusus untuk perangkat Apple (opsional)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
