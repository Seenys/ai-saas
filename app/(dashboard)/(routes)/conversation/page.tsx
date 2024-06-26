"use client";
// hooks
import { useState } from "react";
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
import { MessageSquare } from "lucide-react";
// others
import * as z from "zod";
import { cn } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
// constants
import { formSchema } from "./constants";

const ConversationPage = () => {
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
    values: z.infer<typeof formSchema>
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
        await axios.post("/api/conversation", {
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
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationPage;
