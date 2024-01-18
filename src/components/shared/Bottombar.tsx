import { BottombarLinks } from "@/constants";
import { NavLinkTypes } from "@/types";
import { NavLink, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {BottombarLinks.map((link: NavLinkTypes) => {
        const isActive = pathname === link.route;
        return (
          <NavLink
            to={link.route}
            key={`bottom-bar-${link.label}`}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-1 p-2 transition`}
          >
            <img
              src={link.imgURL}
              className={`group-hover:invert-white ${
                isActive && "invert-white"
              }`}
              width={16}
              height={16}
              alt={link.label}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </NavLink>
        );
      })}
    </section>
  );
};

export default Bottombar;
