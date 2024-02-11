import { Button } from "@/components/ui/button";
import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  return (
    <div className="w-full h-screen max-sm:p-6 p-10 flex items-center justify-center flex-col text-center text-dark dark:text-light">
      <div className="grid place-items-center">
        <h1 className="h1-bold">Oops! Something went wrong.</h1>

        <p className="mt-2 max-w-xl base-regular text-light-2/70">
          {(error as Error).message}. Don't worry, please try again.
        </p>

        <Link to="/" className="mt-6">
          <Button>Go back to home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
