import { auth } from "@clerk/nextjs/server";

import { prisma } from "./prismadb";
import { MAX_FREE_COUNT } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit) {
    await prisma.userApiLimit.update({
      where: {
        userId,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.userApiLimit.create({
      data: {
        userId,
        count: 1,
      },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit) {
    return false;
  }

  if (userApiLimit.count >= MAX_FREE_COUNT) {
    return true;
  }

  return false;
};
