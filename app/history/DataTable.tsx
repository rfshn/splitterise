"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Bill, Prisma, SplitType } from "@prisma/client";
import { FilterIcon, ListOrderedIcon } from "lucide-react";
import React from "react";

interface Props {
  bills: Bill[];
}

type FilterByType = "all" | "equally" | "unequally" | "percentage";
type SortByType = "date" | "total";

const DataTable = ({ bills }: Props) => {
  // console.log((bills.pplInBill));

  bills.forEach((bill) => {
    if (
      bill.pplInBill &&
      typeof bill.pplInBill === "object" &&
      Array.isArray(bill.pplInBill)
    ) {
      const peopleInBill = bill.pplInBill as Prisma.JsonArray;

      console.log(peopleInBill);
    }
  });

  const [filterBy, setFilterBy] = useState<FilterByType>("all");
  const [sortBy, setSortBy] = useState<SortByType>("date");

  const filteredBills = useMemo(() => {
    let filtered = bills;
    if (filterBy !== "all") {
      filtered = filtered.filter((bill) => bill.splitType === filterBy);
    }
    if (sortBy === "date") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "total") {
      filtered = filtered.sort((a, b) => b.totalBill - a.totalBill);
    }
    return filtered;
  }, [bills, filterBy, sortBy]);

  return (
    <section className="w-full max-w-md mx-auto py-12 md:py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Bill History</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View and filter your saved bills.
        </p>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filter by: {filterBy === "all" ? "All" : filterBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuRadioGroup
                value={filterBy}
                onValueChange={(value: string) =>
                  setFilterBy(value as FilterByType)
                }
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="equally">
                  Equally
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unequally">
                  Unequally
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="percentage">
                  Percentage
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <ListOrderedIcon className="w-4 h-4 mr-2" />
                Sort by: {sortBy === "date" ? "Date" : "Total"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={(value: string) =>
                  setSortBy(value as SortByType)
                }
              >
                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="total">
                  Total
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {filteredBills.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No bills saved yet.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredBills.map((bill, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Bill {index + 1}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Total: ${bill.totalBill.toFixed(2)} -{" "}
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-2 text-gray-500 dark:text-gray-400">
                  {bill.description}
                </div>
                <div className="mt-2">
                  <div className="font-semibold">
                    Split Type: {bill.splitType}
                  </div>
                  {bill.splitType === SplitType.equally && (
                    <div>
                      Amount per person:
                      {(
                        bill.pplInBill as Array<{ name: string; share: number }>
                      ).map((person) => (
                        <div key={person.name}>
                          {person.name}: ${person.share.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* {bill.splitType === "unequally" && (
                    <div>
                      {bill.people.map((person, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div>{person}</div>
                          <div>
                            ${parseFloat(bill.personAmounts[i]).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {bill.splitType === "percentage" && (
                    <div>
                      {bill.people.map((person, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div>{person}</div>
                          <div>
                            {parseFloat(bill.personPercentages[i]).toFixed(2)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DataTable;
