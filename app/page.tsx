import React from "react";
import Nome from "@/components/Nome";
import BillSplit from "@/components/BillSplit";

function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <BillSplit />
    </div>
  );
}

export default Home;
