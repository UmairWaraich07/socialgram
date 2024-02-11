import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full min-h-screen max-sm:p-6 p-10 flex items-center justify-center flex-col text-center">
      <div className="grid place-items-center">
        <h1 className="h1-bold">404 Not Found</h1>
        <p className="base-regular max-w-xl mt-2 text-light-2/80">
          Sorry, the page you're looking for could not be found. It might have
          been removed, had its name changed, or be temporarily unavailable.
        </p>
        <Link to="/" className="mt-6">
          <Button className="shad-button_primary">Go back to home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
