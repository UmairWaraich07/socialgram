import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinValidation } from "@/lib/validations";
import { useLoginUser } from "@/react-query/queries";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/userContext";
import authService from "@/appwrite/auth";
import { toast } from "sonner";

const SignInForm = () => {
  const {
    mutateAsync: loginUser,
    isPending: isLoggingUser,
    isError,
    error,
  } = useLoginUser();
  const { setIsAuthenticated, setUserData } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function SignIn(values: z.infer<typeof signinValidation>) {
    try {
      const session = await loginUser(values);
      if (session) {
        const currentUser = await authService.getCurrentUser();
        console.log({ currentUser });
        if (currentUser) {
          setUserData({
            id: currentUser.$id,
            email: currentUser.email,
            username: currentUser.name,
          });
          setIsAuthenticated(true);

          form.reset();
          navigate("/", { replace: true });
        }
      } else {
        toast("Log in failed. Try again");
      }
    } catch (error) {
      console.log(`Error on loggin in user : ${error}`);
      throw new Error((error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/public/assets/images/logo.svg" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
          Welcome back! Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(SignIn)}
          className="w-full flex flex-col mt-4 gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>

                <FormMessage className="text-red" />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

                <FormMessage className="text-red" />
              </FormItem>
            )}
          />

          {isError ? (
            <div className="text-red text-sm">{error.message}</div>
          ) : null}

          <Button
            type="submit"
            className="shad-button_primary"
            disabled={isLoggingUser}
          >
            {isLoggingUser ? (
              <p className="flex-center gap-2">
                <ReloadIcon className="animate-spin" />
                Loggin in...
              </p>
            ) : (
              "Log In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
