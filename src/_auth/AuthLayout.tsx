import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useUserContext } from "@/contexts/UserContext";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" replace={true} />
      ) : (
        <div className="flex ">
          <section className="flex-center flex-1 flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/side-img.svg"
            alt="Logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />

          <Toaster />
        </div>
      )}
    </>
  );
};

export default AuthLayout;
