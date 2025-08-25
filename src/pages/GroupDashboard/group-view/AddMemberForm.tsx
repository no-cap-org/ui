import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API } from "@/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusSquare,  UserRoundCheck, UserRoundPlus, UserRoundSearchIcon, UserRoundX } from "lucide-react";

enum QueryState {
  ADD,
  LOADING,
  SUCCESS,
  FAILED
}

export function AddMemberButton({ groupId, onSuccess }: { groupId: string; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [queryState, setQueryState] = useState<QueryState>(QueryState.ADD);

  const handleAdd = async () => {
    if (!email) return toast.error("Email is required");

    setQueryState(QueryState.LOADING);
    try {
      await API.METHODS.POST(
        API.ENDPOINTS.group.addMember(groupId),
        { email },
        { withCredentials: true },
        {
          onSuccess: (response) => { 
            toast.success(response.message) 
            setQueryState(QueryState.SUCCESS)
          },
          onError: (response) => { 
            toast.error(response.message) 
            setQueryState(QueryState.FAILED)
          }
        }
      );
      setEmail("");
      onSuccess();
    } catch (err) {
      toast.error("Failed to add member");
    } finally {
      setTimeout(() => setQueryState(QueryState.ADD),3000)
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer" variant="ghost" size="sm">
          <span className="md:hidden underline">Add Member</span>
          <PlusSquare className="hidden md:block"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white w-72 p-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <motion.div
            whileFocus={{ scale: 1.02, boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input
              type="email"
              placeholder="Enter member email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>
          <motion.div>
            <Button className="hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer" variant="outline" onClick={handleAdd} disabled={!email}>
              {
                queryState == QueryState.FAILED ? < UserRoundX color="red"/> :
                queryState == QueryState.LOADING ? <UserRoundSearchIcon color="yellow"/>:
                queryState == QueryState.SUCCESS ? <UserRoundCheck color="green"/> :
                <UserRoundPlus/>
              }
            </Button>
          </motion.div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

