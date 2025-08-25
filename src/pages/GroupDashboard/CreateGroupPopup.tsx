import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "@/providers/SessionProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { API } from "@/api";
import { z } from "zod";
import { PopoverClose } from "@radix-ui/react-popover";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export function CreateGroupPopup({ onGroupCreated }: { onGroupCreated: () => void }) {
  const { userId } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    API.METHODS.POST(
      API.ENDPOINTS.group.create,
      { ownerId: userId, ...data },
      { withCredentials: true },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          onGroupCreated();
        },
        onError: () => toast.error("Failed to create group"),
      }
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer" variant="outline">Create</Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <h4 className="text-lg font-semibold">Create New Group</h4>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Group description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PopoverClose asChild>
                <Button variant="outline" type="submit">
                  Submit
                </Button>
              </PopoverClose>
            </form>
          </Form>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
