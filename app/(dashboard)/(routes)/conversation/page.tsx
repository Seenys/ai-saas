"use client";
// hooks
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// components
import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// icons: https://lucide.dev/icons
import { MessageSquare } from "lucide-react";
// others

import * as z from "zod";
// constants
import { formSchema } from "./constants";
import { Input } from "@/components/ui/input";

const ConversationPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <Heading
        title="Conversation"
        description="This is the conversation page"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                        rounded-lg
                        border
                        w-full
                        p-4
                        px-3
                        md:px-6focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap-2
                    "
            >
              <FormField
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do i calculate the area of a circle?"
                      />
                    </FormControl>
                  </FormItem>
                )}
                name="prompt"
              />
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ConversationPage;
