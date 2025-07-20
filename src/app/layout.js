import localFont from "next/font/local";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper"; // <-- CORRECTED PATH

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
  title: "Task Manager",
  description: "Task Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}