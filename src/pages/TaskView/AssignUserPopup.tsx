import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API } from "@/api";

export default function AssignUserPopover({ assignmentId, onTaskAssigned }: { assignmentId: string, onTaskAssigned: () => {} }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    setLoading(true);
    await API.METHODS.PUT(API.ENDPOINTS.assignment.assignTaskTo(assignmentId), { email }, { withCredentials: true }, {
      onSuccess: (response) => {
        toast.success(response.message)
        onTaskAssigned()
      },
      onError: (response) => toast.error(response.message)
    })
    setLoading(false)
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="cursor-pointer hover:bg-gray-900 hover:text-white" variant="outline" size="sm">Assign User</Button>
      </PopoverTrigger>
      <PopoverContent className=" bg-white w-80">
        <div className="flex flex-col space-y-3">
          <Input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="outline" onClick={handleAssign} disabled={loading || !email}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
