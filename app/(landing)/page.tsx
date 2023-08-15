import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <>
      <h1>Landing Page</h1>
      <div>
        <Link href={"/sign-in"}>
          <Button>Sign-in</Button>
        </Link>
        <Link href={"/sign-up"}>
          <Button>Sign-up</Button>
        </Link>
      </div>
    </>
  );
};

export default LandingPage;
