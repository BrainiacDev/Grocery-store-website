import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobileHook";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  // console.log("Location: ", location);

  const redirectToSearchPage = () => {
    // Redirect to search page
    navigate("/search");
  };

  // console.log("search page: ", isSearchPage);

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border p-1 overflow-hidden flex items-center text-neutral-400 bg-slate-50 group focus-within:border-[#ffbf00]">
      <div>
        {isMobile && isSearchPage ? (
          <Link to={"/"} className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-[#ffbf00] bg-white rounded-full shadow-md">
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-[#ffbf00]">
            <IoSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          //   not in search page
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Search 'milk'",
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                "Search 'bread'",
                1000,
                "Search 'sugar'",
                1000,
                "Search 'panner'",
                1000,
                "Search 'chocolate'",
                1000,
                "Search 'curd'",
                1000,
                "Search 'rice'",
                1000,
                "Search 'egg'",
                1000,
                "Search 'chips'",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          //  when in search page
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for milk and more"
              autoFocus
              className="bg-transparent w-full h-full outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
