// OpenAi imports

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

export const POST = async (req: Request) => {
  try {
    const { userId }: { userId: string | null } = auth();
    const body = await req.json();
    const { prompt, amount, resolution } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAi API key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: parseInt(amount),
      size: resolution,
    });
    return NextResponse.json(response.data);
  } catch (e) {
    console.log("[CONVERSATION_ERROR]: ", e);
    return new NextResponse("Internal Server Error here", { status: 500 });
  }
};
