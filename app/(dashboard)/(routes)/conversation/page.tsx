// components
import { Heading } from "@/components/heading";
// icons: https://lucide.dev/icons
import { MessageSquare } from "lucide-react";

const ConversationPage = () => {
  return (
    <>
      <Heading
        title="Conversation"
        description="This is the conversation page"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8"></div>
    </>
  );
};

export default ConversationPage;
