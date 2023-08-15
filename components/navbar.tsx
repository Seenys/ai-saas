// Components
import { Button } from "@/components/ui/button";
// auth Components
import { UserButton } from "@clerk/nextjs";
//Icons
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex items-center p-4">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu />
      </Button>
      <div className="flex w-full justify-end ">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
