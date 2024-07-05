import React from "react";
import BillHistory from "@/components/BillHistory";
import prisma from "@/prisma/db";
import DataTable from "./DataTable";

const History = async () => {
  const bills = await prisma.bill.findMany();
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* <p>History, we are in history page</p> */}
      <DataTable bills={bills} />
    </div>
  );
};

export default History;
