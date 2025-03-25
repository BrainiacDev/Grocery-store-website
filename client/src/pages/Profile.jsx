import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user);
  console.log("Profile", user);

  return (
    <div>
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-700 overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full" />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button className="text-xs border min-w-20 px-3 py-1 rounded-full mt-3 border-[#ffc929] hover:border-[#ffbf00] hover:bg-[#ffbf00] cursor-pointer">
        Edit
      </button>
    </div>
  );
};

export default Profile;
