import { API } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FirebaseAuthService } from "@/lib/firebase/FirebaseAuthService";
import { useSession } from "@/providers/SessionProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { DatePicker } from "@/components/datepicker";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingStickMan from "@/assets/StickMan Walking.gif";


const FormSchema = z.object({
  email: z.string({ required_error: "An email address is required" }).email({ message: "Please provide a valid email address" }),
  password: z.string({ required_error: "A password is required" }).min(8, { message: "Password must be at least 8 characters" }),
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  dob: z.date({ required_error: "Date of Birth is required" }).max(new Date(), { message: "Date cannot be in the future" }),
  phoneNo: z.string({ required_error: "Phone number is required" }).min(10, { message: "Phone number must be at least 10 digits" })
});

export default function SignUp() {
  const firebaseAuthService = FirebaseAuthService.getInstance();
  const navigate = useNavigate();
  const { email, setEmail, setSessionId, setUserId, isLoading: isSessionLoading } = useSession();
  const [loading, setLoading] = useState<boolean>(false || isSessionLoading);

  useEffect(() => { setLoading(isSessionLoading); }, [isSessionLoading]);
  useEffect(() => { if (email) navigate("/groups"); }, [email]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "", dob: new Date(), phoneNo: "" }
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);

    try {
      const { email, password } = values;
      const user = await firebaseAuthService.signUpUserWithEmailAndPassword({ email, password });

      if (!user) { 
        toast.error("User not found"); 
        setLoading(false); 
        return; 
      }


      await API.METHODS.POST(
        API.ENDPOINTS.user.signup,
        { token: await user.getIdToken(), ...values },
        { withCredentials: true },
        {
          onSuccess: (message) => {
            toast.success("Account created successfully!");
            setEmail(message.email);
            setUserId(message.userId);
            setSessionId(message.sessionId); 
            navigate("/groups");
          },
          onError: (data: any) => { toast.error(data?.message || "Signup failed"); }
        }
      );
    } catch (error: unknown) { toast.error(String(error)); }

    setLoading(false);
  };

  if (loading) 
    return 
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8">
        <img src={LoadingStickMan} className="size-36" />
      </div>;

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-lg sm:max-w-lg lg:max-w-xl rounded-2xl bg-white shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-xl border-slate-300">
          <CardHeader>
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">Join us today! Fill in your details to get started.</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form className="flex flex-col gap-4 sm:gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input placeholder="John" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>

                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl><DatePicker value={field.value} onDateSelect={(date) => field.onChange(date)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="phoneNo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input placeholder="1234567890" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input placeholder="example@mail.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Button type="submit" variant="outline" className="w-full font-semibold">Create Account</Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="justify-center text-sm text-center text-muted-foreground flex flex-wrap gap-2">
            Have an account?
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-blue-500 hover:underline">Login</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
