import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError";
import { HiOutlineExternalLink } from "react-icons/hi";

const UsersMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });

      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">{user.name || user.mobile}</span>
        <Link to={"/dashboard/profile"} className="hover:text-[#ffbf00]">
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />
      <div className="text-sm grid gap-2">
        <Link to={"/dashboard/myorders"} className="px-2 hover:bg-orange-200 py-1">My Orders</Link>
        <Link to={"/dashboard/address"} className="px-2 hover:bg-orange-200 py-1">Save Address</Link>

        <button
          onClick={handleLogout}
          className="text-left px-2 cursor-pointer hover:bg-orange-200 py-1"
        >
          Log Out
        </button>
        
      </div>
    </div>
  );
};

export default UsersMenu;
