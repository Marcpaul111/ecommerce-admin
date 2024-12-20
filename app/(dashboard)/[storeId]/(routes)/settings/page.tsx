import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import SettingsForm from "./components/SettingsForm";
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/ui/ApiList";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
    include: {
      images: true,
      mobileImages: true,
    }
  });

  if (!store) {
    redirect("/");
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
