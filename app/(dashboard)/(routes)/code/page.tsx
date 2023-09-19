"use client";
// hooks
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// components
import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Empty } from "@/components/empty";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Loader } from "@/components/loader";
// types
import { ChatCompletionRequestMessage } from "openai";
// icons: https://lucide.dev/icons
import { Code } from "lucide-react";
// others
import * as z from "zod";
import { cn } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import ReactMarkdown from "react-markdown";
// constants
import { formSchema } from "./constants";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading: boolean = form.formState.isSubmitting;

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
  ): Promise<void> => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages: ChatCompletionRequestMessage[] = [
        ...messages,
        userMessage,
      ];

      const response: AxiosResponse<ChatCompletionRequestMessage> =
        await axios.post("/api/code", {
          messages: newMessages,
        });

      setMessages((current: ChatCompletionRequestMessage[]) => [
        ...current,
        userMessage,
        response.data,
      ]);

      form.reset();
    } catch (e: any) {
      //TODO: premium plan
      console.log(e);
    } finally {
      router.refresh();
    }
  };

  return (
    <>
      <Heading
        title="Code Generation"
        description="Generate code from natural language"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
                        placeholder="Simple toggle button using React"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
                name="prompt"
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="Nothing Here..." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message: ChatCompletionRequestMessage) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-center gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 p-1 rounded-lg" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodePage;
