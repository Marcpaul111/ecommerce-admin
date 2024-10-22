import { getChartData } from "@/actions/getChartData";
import { getTotalSalesCount } from "@/actions/getSales";
import { getTotalStockCount } from "@/actions/getStockCount";
import { getTotalRevenue } from "@/actions/getTotalRevenue";
import Overview from "@/components/Overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, PackageOpen, PhilippinePeso } from "lucide-react";
import React from "react";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId);

  const totalSales = await getTotalSalesCount(params.storeId);

  const totalStock = await getTotalStockCount(params.storeId);

  const chartData = await getChartData(params.storeId);

  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 py-8 p-6">
        <Heading title="Dashboard" description="Overview of the store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          {/*  */}
          <Card>
            <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>
          {/*  */}
          <Card>
            <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl">+ {totalSales}</div>
            </CardContent>
          </Card>
          {/*  */}
          <Card>
            <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Products in Stock
              </CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{totalStock}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
