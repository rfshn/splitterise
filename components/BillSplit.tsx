"use client";

import { useState, useCallback } from "react";

import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { billSchema } from "@/ValidationSchemas/Bill";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { FormControl, FormField, FormItem, FormLabel, Form } from "./ui/form";

type BillFormData = z.infer<typeof billSchema>;

const BillSplit = () => {
  const form = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
  });

  const [totalBill, setTotalBill] = useState<number>(0);
  const [people, setPeople] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<
    "equally" | "unequally" | "percentage"
  >("equally");
  const [description, setDescription] = useState<string>("");
  const [personAmounts, setPersonAmounts] = useState<string[]>([]);
  const [personPercentages, setPersonPercentages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addPerson = () => {
    setPeople([...people, ""]);
    setPersonAmounts([...personAmounts, ""]);
    setPersonPercentages([...personPercentages, ""]);
  };

  const removePerson = (index: number) => {
    const updatedPeople = [...people];
    updatedPeople.splice(index, 1);
    setPeople(updatedPeople);

    const updatedAmounts = [...personAmounts];
    updatedAmounts.splice(index, 1);
    setPersonAmounts(updatedAmounts);

    const updatedPercentages = [...personPercentages];
    updatedPercentages.splice(index, 1);
    setPersonPercentages(updatedPercentages);
  };

  const updatePersonName = (index: number, name: string) => {
    const updatedPeople = [...people];
    updatedPeople[index] = name;
    setPeople(updatedPeople);
  };

  const calculateAmountPerPerson = (index: number): number => {
    if (splitType === "equally" && people.length > 0) {
      return totalBill / people.length;
    } else if (splitType === "percentage") {
      const percentage = parseFloat(personPercentages[index]);
      return percentage > 0 ? (totalBill * percentage) / 100 : 0;
    }
    return 0;
  };

  const updatePersonAmount = (index: number, amount: string) => {
    const updatedAmounts = [...personAmounts];
    updatedAmounts[index] = amount;
    setPersonAmounts(updatedAmounts);
    console.log(updatedAmounts);
  };

  const updatePersonPercentage = (index: number, percentage: string) => {
    const updatedPercentages = [...personPercentages];
    updatedPercentages[index] = percentage;
    setPersonPercentages(updatedPercentages);
  };

  async function onSubmit(values: z.infer<typeof billSchema>) {
    console.log(values);
    try {
      setIsSubmitting(true);
      setError("");

      const pplInBill = people.map((person, index) => ({
        name: person,
        share: calculateAmountPerPerson(index),
      }));

      const billData = {
        ...values,
        pplInBill,
        totalBill: parseFloat(values.totalBill.toString()),
      };

      await axios.post("/api/bills", billData);
    } catch (error) {
      console.log(error);
      setError("Unknown Error Occured");
      setIsSubmitting(false);
    }
  }

  // console.log(totalBill);
  // console.log(splitType);
  // console.log(updatedAmounts);
  // console.log(people);
  return (
    <section className="w-full max-w-md mx-auto py-12 md:py-16">
      <div className="space-y-4 text-cente">
        <h1 className=" text-center text-3xl font-bold tracking-tight">
          Bill Splitter
        </h1>
        <p className=" text-center text-gray-500 dark:text-gray-400">
          Easily split the bill and share it with your group.
        </p>
      </div>

      <Form {...form}>
        <form className="my-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split Type</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {["equally", "unequally", "percentage"].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={splitType === type ? "default" : "outline"}
                          onClick={() => {
                            setSplitType(
                              type as "equally" | "unequally" | "percentage"
                            );
                            field.onChange(type);
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* <Label>Split Type</Label>
            <div className="flex item-center gap-4">
              <Button
                type="button"
                variant={splitType === "equally" ? "default" : "outline"}
                onClick={() => setSplitType("equally")}
              >
                Equally
              </Button>
              <Button
                type="button"
                variant={splitType === "unequally" ? "default" : "outline"}
                onClick={() => setSplitType("unequally")}
              >
                Unequally
              </Button>
              <Button
                type="button"
                variant={splitType === "percentage" ? "default" : "outline"}
                onClick={() => setSplitType("percentage")}
              >
                Percentage
              </Button>
            </div> */}
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="totalBill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Bill</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total bill amount"
                      {...field}
                      value={totalBill}
                      onChange={(e) => setTotalBill(parseFloat(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormLabel>People on the Bill</FormLabel>
            <div className="space-y-2">
              {people.map((person, index) => (
                <FormItem key={index}>
                  <FormControl>
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        className={`${
                          splitType === "percentage" ? "w-1/2" : "w-3/4"
                        }`}
                        id={`person-${index}`}
                        type="text"
                        placeholder="Enter name"
                        value={person}
                        // required
                        onChange={(e) =>
                          updatePersonName(index, e.target.value)
                        }
                      />
                      {splitType === "equally" && (
                        <div className="text-gray-500 dark:text-gray-400">
                          {calculateAmountPerPerson(index)?.toFixed(2)}
                        </div>
                      )}

                      {splitType === "unequally" && (
                        <Input
                          className="max-w-24"
                          id={`person-amount-${index}`}
                          type="number"
                          placeholder="Enter amount"
                          min="0"
                          step="0.01"
                          value={personAmounts[index]}
                          onChange={(e) =>
                            updatePersonAmount(index, e.target.value)
                          }
                        />
                      )}

                      {splitType === "percentage" && (
                        <div className="flex items-center gap-2">
                          <Input
                            className="max-w-24"
                            id={`person-percentage-${index}`}
                            type="number"
                            placeholder="Enter percentage"
                            min="0"
                            step="0.01"
                            value={personPercentages[index]}
                            onChange={(e) =>
                              updatePersonPercentage(index, e.target.value)
                            }
                          />
                          <div className="text-gray-500 dark:text-gray-400 max-w-11">
                            {calculateAmountPerPerson(index)?.toFixed(2)}
                          </div>
                        </div>
                      )}

                      <Button
                        className="min-w-8"
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removePerson(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Remove person</span>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              ))}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addPerson}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Add person</span>
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <div className="grid gap-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  placeholder="Enter a description for the bill"
                  rows={3}
                  {...field}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}
          />

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              // onClick={saveBill}
              className="w-full bg-gray-900 text-gray-50 hover:bg-gray-800 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            >
              Save Bill
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default BillSplit;
