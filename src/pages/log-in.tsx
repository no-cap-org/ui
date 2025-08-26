import { API } from "@/api";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FirebaseAuthService } from "@/lib/firebase/FirebaseAuthService";
import { useSession } from "@/providers/SessionProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import LoadingStickMan from "@/assets/StickMan Walking.gif";

const FormSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
  password: z.string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const firebaseAuthService = FirebaseAuthService.getInstance();
  const { setSessionId, setUserId, setEmail } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const user = await firebaseAuthService.loginWithEmailAndPassword({ email, password });
      if (!user) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      await API.METHODS.POST(
        API.ENDPOINTS.user.login,
        { token: await user.getIdToken(), ...values },
        { withCredentials: true },
        {
          onSuccess: (message) => {
            toast.success("Logged in successfully", { description: message.email });
            setEmail(message.email);
            setSessionId(message.sessionId);
            setUserId(message.userId);
            navigate(location.state?.from || "/groups");
          },
          onError: (data: any) => {
            toast.error(data.message);
          },
        }
      );
    } catch (error) {
      toast.error(String(error));
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? 
      (
        <div className="px-6 py-4">
          <img src={LoadingStickMan} className="size-36" />
        </div>
      ) : 
      (
            
        <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
          <motion.div
            className="min-w-sm sm:min-w-md max-w-lg lg:max-w-xl rounded-2xl bg-white shadow-xl"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Card className="shadow-xl border-slate-300">
              <CardHeader>
                <CardTitle className="text-center text-2xl sm:text-3xl font-bold">Sign In</CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  Welcome back! Enter your credentials to continue.
                </CardDescription>
              </CardHeader>

              
              <CardContent>
                <Form {...form}>
                  <form
                    className="flex flex-col gap-4 sm:gap-5"
                    onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button className="mt-2 w-full" type="submit" variant="outline">
                      Sign In
                    </Button>
                  </form>
                </Form>
              </CardContent>

              <CardFooter className="justify-center text-sm text-muted-foreground flex flex-wrap gap-2">
                Don’t have an account?
                <Button
                  variant="ghost"
                  onClick={() => navigate("/sign-up")}
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </Button>
              </CardFooter>
                
            </Card>
          </motion.div>
        </div>
      )}
    </>
  );
}
