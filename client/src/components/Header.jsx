import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import {BsCart4} from "react-icons/bs";
import useMobile from "../hooks/useMobileHook";
import { useSelector } from "react-redux";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state.user)
  
  console.log("User from store", user)

  const redirectToLoginPage = () => {
    // Redirect to login page
    navigate("/login");
  }



  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/* Logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                alt="Logo"
                width={170}
                height={60}
                className="hidden lg:block"
              />
              <img
                src={logo}
                alt="Logo"
                width={120}
                height={60}
                className="lg:hidden"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* Login and add to cart */}
          <div className="">
            {/* User icons display in mobile only */}
            <div>
              <button className="text-neutral-600 lg:hidden">
                <FaRegCircleUser size={25} />
              </button>
            </div>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-10">
              <button onClick={redirectToLoginPage} className="text-lg px-2 cursor-pointer">
                Login
              </button>
              <button className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-3 rounded cursor-pointer text-white">
                {/* add to cart icon */}
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold">
                  <p>My Cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;
