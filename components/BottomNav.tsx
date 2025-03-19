// components/BottomNav.tsx
/*
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
*/

import Link from "next/link";
import { FaHome, FaUserAlt, FaPlus } from "react-icons/fa";
import { useUser } from "./UserContext";

export default function BottomNav() {
  const { role } = useUser();
  return (
    <nav className="absolute bottom-0 left-0 right-0 flex justify-around items-center py-4 bg-transparent z-30">
      <Link href="/">
        <FaHome className="text-white text-2xl" />
      </Link>
      {role === 'company' && (
        <Link href="/upload">
          <FaPlus className="text-white text-2xl" />
        </Link>
      )}
      <Link href="/profile">
        <FaUserAlt className="text-white text-2xl" />
      </Link>
    </nav>
  );
}
