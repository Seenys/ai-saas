// OpenAi imports

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Limitss imports
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

export const POST = async (req: Request) => {
  try {
    const { userId }: { userId: string | null } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAi API key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrialLimitReached = await checkApiLimit();

    if (freeTrialLimitReached) {
      return new NextResponse("Free trial limit reached", { status: 403 });
    }

    console.log("[CONVERSATION_REQUEST]: ", messages);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    await increaseApiLimit();

    return NextResponse.json(response.choices[0].message);
  } catch (e) {
    console.log("[CONVERSATION_ERROR]: ", e);
    return new NextResponse("Internal Server Error here", { status: 500 });
  }
};
