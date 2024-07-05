import z from "zod";

export const billSchema = z.object({
  splitType: z.string().min(1, "SplitType").max(10).optional(),
  totalBill: z.number().int(),
  pplInBill: z.any(),
  description: z.string().min(1, "Description is required").max(65535),
});
