import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { SignupValidation } from "@/lib/validations";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUser, useRegisterUser } from "@/react-query/queries";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import authService from "@/appwrite/auth";
import { useUserContext } from "@/contexts/UserContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserData } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
    },
  });

  const registerUser = useRegisterUser();
  const loginUser = useLoginUser();

  async function create(values: z.infer<typeof SignupValidation>) {
    try {
      const createdUser = await registerUser.mutateAsync(values);
      if (!createdUser) {
        toast("Sign up failed. Please try again.");
      }

      // login the user
      const user = await loginUser.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (!user) {
        toast("Log in failed. Please try again.");
      }
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUserData({
          id: userData.$id,
          username: userData.username,
          email: userData.email,
          fullname: userData.fullname,
          profilePicture: userData.profilePicture,
        });
        setIsAuthenticated(true);
        form.reset();
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(`Error on registering the user : ${error}`);
      toast("Sign up failed. Please try again.");
      throw new Error((error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/public/assets/images/logo.svg" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
          To use snapgram please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(create)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage className="text-red" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage className="text-red" />
              </FormItem>
            )}
          />
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
                  <Input
                    type="password"
                    className="shad-input relative"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-red" />
              </FormItem>
            )}
          />

          {registerUser.isError ? (
            <div className="text-red text-sm">{registerUser.error.message}</div>
          ) : null}

          <Button
            type="submit"
            className="shad-button_primary"
            disabled={registerUser.isPending}
          >
            {registerUser.isPending ? (
              <p className="flex-center gap-2">
                <ReloadIcon className="animate-spin" />
                Registering User...
              </p>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1 hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
