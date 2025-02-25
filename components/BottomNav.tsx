// components/BottomNav.tsx
import Link from "next/link";
import { FaHome, FaUserAlt } from "react-icons/fa";

export default function BottomNav() {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "#000",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #333",
      }}
    >
      <Link href="/" style={{ color: "#0070f3", fontSize: "1.8rem" }}>
        <FaHome />
      </Link>
      <Link href="/profile" style={{ color: "#0070f3", fontSize: "1.8rem" }}>
        <FaUserAlt />
      </Link>
    </nav>
  );
}
