import * as z from "zod";
import { AmountResolutionOption } from "@/app/(dashboard)/(routes)/image/types";

export const formSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: "Image prompt must be at least 1 character long." }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

export const amountOptions: AmountResolutionOption[] = [
  {
    value: "1",
    label: "1 Photo",
  },
  {
    value: "2",
    label: "2 Photos",
  },
  {
    value: "3",
    label: "3 Photos",
  },
  {
    value: "4",
    label: "4 Photos",
  },
  {
    value: "5",
    label: "5 Photos",
  },
];

export const resolutionOptions: AmountResolutionOption[] = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];
