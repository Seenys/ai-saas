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
import { Loader } from "@/components/loader";

// icons: https://lucide.dev/icons
import { Video } from "lucide-react";
// others
import * as z from "zod";
import axios, { AxiosResponse } from "axios";
// constants
import { formSchema } from "./constants";

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string>();

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
      setVideo(undefined);

      const response: AxiosResponse = await axios.post("/api/video", values);

      setVideo(response.data);
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
        title="Video Generation"
        description="Turn your prompt into a video"
        icon={Video}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                        placeholder="Animate Your Personalized Text-to-Image"
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
          {!video && !isLoading && <Empty label="No Video Generated..." />}
          {video && (
            <video
              className="w-full aspect-video mt-8 rounded-lg border bg-black"
              controls
            >
              <source src={video} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoPage;
