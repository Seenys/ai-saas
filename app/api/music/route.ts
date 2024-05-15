// OpenAi imports

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Replicate from "replicate";

// Limitss imports
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const POST = async (req: Request) => {
  try {
    const { userId }: { userId: string | null } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const freeTrialLimitReached = await checkApiLimit();

    if (freeTrialLimitReached) {
      return new NextResponse("Free trial limit reached", { status: 403 });
    }

    const input = {
      prompt_b: prompt,
    };

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input }
    );
    await increaseApiLimit();
    return NextResponse.json(response);
  } catch (e) {
    console.log("[MUSIC_ERROR]: ", e);
    return new NextResponse("Internal Server Error here", { status: 500 });
  }
};
