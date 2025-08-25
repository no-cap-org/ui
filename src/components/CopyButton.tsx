import { toast } from "sonner";
import { Button } from "./ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

interface PropsI {
  link: string
}

export default function CopyLinkButton({ link }: PropsI ) {

  const [isCopied, setIsCopied ] = useState<boolean>(false);

  return (
    <>
      <Button
        className="cursor-pointer"
        variant="link"
        onClick={() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false),3000);
          navigator.clipboard.writeText(
            link
          );
          toast.success("Group join link copied to clipboard");
        }}
      >
        {
          isCopied ?
          <CopyCheckIcon color="green"/> : <CopyIcon/>
        }
      </Button>
    </>
  )

}