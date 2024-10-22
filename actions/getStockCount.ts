import prismadb from "@/lib/prismadb"


export const getTotalStockCount = async (storeId: string) => {
    const stocks = await prismadb.products.count({
        where: {
            storeId,
            isArchived: false
        },
    })

   return stocks;

}