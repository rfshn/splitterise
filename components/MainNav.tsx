import Link from "next/link";
import React from "react";
import ToggleMode from "./ToggleMode";
import { MountainIcon } from "lucide-react";
import MainNavLinks from "./MainNavLinks";

const MainNav = () => {
  return (
    <div className="flex justify-between ">
      <div className="flex gap-2 items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>

        <MainNavLinks />
      </div>
      <div className="flex gap-2 items-center">
        <Link href="/" className="navbar-link">
          Logout
        </Link>
        <ToggleMode />
      </div>
    </div>
  );
};

export default MainNav;
