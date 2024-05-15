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
      seed: 255224557,
      n_prompt:
        "badhandv4, easynegative, ng_deepnegative_v1_75t, verybadimagenegative_v1.3, bad-artist, bad_prompt_version2-neg, teeth",
      prompt: prompt,
    };

    const response = await replicate.run(
      "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f",
      { input }
    );
    await increaseApiLimit();
    return NextResponse.json(response);
  } catch (e) {
    console.log("[MUSIC_ERROR]: ", e);
    return new NextResponse("Internal Server Error here", { status: 500 });
  }
};
