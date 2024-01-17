import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const AuthLayout = () => {
  return (
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
  );
};

export default AuthLayout;
