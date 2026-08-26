import type { ReactNode } from "react";
import Navbar from "../components/common/Navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}