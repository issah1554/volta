import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import TopNav from "@/components/layout/TopNavBar";

export const metadata = {
  title: "About IssaH",
  description: "Demo App",
  icons: {
    icon: "/5-circle-fill.svg", //
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scrollbar-thin scrollbar-thumb-primary-500  ">
      <body className="antialiased ">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
