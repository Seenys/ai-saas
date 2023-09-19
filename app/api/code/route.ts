// OpenAi imports

import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionsMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator, You must answer only in markdown code snippets. Use code comments to explain your code.",
};

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

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [instructionsMessage, ...messages],
    });
    return NextResponse.json(response.data.choices[0].message);
  } catch (e) {
    console.log("[CODE_ERROR]: ", e);
    return new NextResponse("Internal Server Error here", { status: 500 });
  }
};
