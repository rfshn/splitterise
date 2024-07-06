import z from "zod";

export const billSchema = z.object({
  splitType: z.string().min(1, "SplitType").max(10).optional(),
  totalBill: z.number().min(0, "Total bill must be a positive number"),
  pplInBill: z.array(
    z.object({
      name: z.string().min(1),
      share: z.number().min(0),
    })
  ),
  description: z.string().min(1, "Description is required").max(65535),
});
