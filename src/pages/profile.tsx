import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/datepicker";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";

// ✅ Validation Schema
const ProfileSchema = z.object({
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  phoneNo: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  dob: z.date({ required_error: "Date of Birth is required" }).max(new Date(), { message: "Date cannot be in the future" }),
});


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSession()

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      dob: new Date(user?.dob || new Date().toISOString()) ,
      phoneNo: user?.phoneNo,
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      // TODO: Replace with API call
      console.log("Profile Updated:", values);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center pt-6 sm:pt-0 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-lg lg:max-w-xl text-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-2xl border-0 rounded-2xl bg-white bg-gradient-to-br from-white/65 via-white/75 to-white">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">My Profile</CardTitle>
            <CardDescription className="text-center">View and edit your profile details</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Email (always read-only) */}
                <div>
                  <FormLabel>Email</FormLabel>
                  <p className="text-muted-foreground rounded-md py-2">{user?.email}</p>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        {isEditing ? (
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                        ) : (
                          <p className="text-muted-foreground rounded-md py-2">
                            {field.value}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        {isEditing ? (
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                        ) : (
                          <p className="text-muted-foreground rounded-md py-2">
                            {field.value}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="w-fit">
                      <FormLabel>Date of Birth</FormLabel>
                      {isEditing ? (
                        <FormControl>
                          <DatePicker
                            
                            value={field.value}
                            onDateSelect={(date) => field.onChange(date)}
                          />
                        </FormControl>
                      ) : (
                        <p className="text-muted-foreground rounded-md py-2">
                          {field.value.toLocaleDateString()}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem className="w-fit">
                      <FormLabel>Phone Number</FormLabel>
                      {isEditing ? (
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                      ) : (
                        <p className="text-muted-foreground rounded-md py-2">
                          {field.value}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          form.reset();
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                        <Button type="submit" variant="outline" className="font-semibold">
                          Save
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="font-semibold"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="justify-center text-sm text-muted-foreground">
            Profile last updated: {user?.updatedAt.toDateString()}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
