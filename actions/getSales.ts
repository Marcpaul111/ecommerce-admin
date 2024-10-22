import prismadb from "@/lib/prismadb"


export const getTotalSalesCount = async (storeId: string) => {
    const sales = await prismadb.orders.count({
        where: {
            storeId,
            isPaid: true
        },
    })

   return sales;

}