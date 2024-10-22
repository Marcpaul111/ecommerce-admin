import { UserButton } from "@clerk/nextjs";
import React from "react";
import MainNav from "./MainNav";
import StoreSwitcher from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeSwitch } from "./ThemeSwitch";

const Navbar = async () => {
  // fetch store
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="border-b-2">
      <div className="flex h-16 px-4 items-center">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6 " />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
