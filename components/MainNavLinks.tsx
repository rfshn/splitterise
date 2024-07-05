"use client";
import { link } from "fs";
import { Key } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MainNavLinks = () => {
  const links = [
    { label: "Bill Splitter", href: "/" },
    { label: "History", href: "/history" },
  ];

  const currentPath = usePathname();

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <Link
          href={link.href}
          className={`navbar-link ${
            currentPath == link.href &&
            "cursor-default text primary/70 hover: text-primary/60"
          }`}
          key={link.label}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default MainNavLinks;
