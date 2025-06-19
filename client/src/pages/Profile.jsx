import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import { useEffect } from "react";
import SummaryApi from "../common/summaryApi";
import Axios from "../utils/axios";
import AxiosToastError from "../utils/axiosToastError";
import toast from "react-hot-toast";
import fetchUserDetails from "../utils/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";

const Profile = () => {
  const user = useSelector((state) => state.user);
  // console.log("Profile", user);
  const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    })
  },[user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      }
    }
    );
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData

      })

      const {data: responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
      
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }

  }

  return (
    // Profile upload and display avatar
    <div>
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-700 overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full" />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button
        onClick={() => setOpenProfileAvatarEdit(true)}
        className="text-xs border min-w-20 px-3 py-1 rounded-full border-[#ffc929] hover:border-[#ffbf00] hover:bg-[#ffbf00] cursor-pointer mt-3"
      >
        Edit
      </button>

      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
      )}

      {/* name, email, mobile and password */}
      <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid">
          <label>Name</label>
          <input type="text" placeholder="Enter your name"
            className="p-2 bg-blue-50 outline-none border focus-within:border-[#ffbf00] rounded"
            value={userData.name}
            name="name"
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="grid">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Enter your email"
            className="p-2 bg-blue-50 outline-none border focus-within:border-[#ffbf00] rounded"
            value={userData.email}
            name="email"
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="grid">
          <label htmlFor="mobile">Mobile</label>
          <input id="mobile" type="number" placeholder="Enter your mobile number"
            className="p-2 bg-blue-50 outline-none border focus-within:border-[#ffbf00] rounded"
            value={userData.mobile}
            name="mobile"
            onChange={handleOnChange}
            required
          />
        </div>

        <button className="border px-4 py-2 font-semibold hover:bg-[#ffbf00] border border-[#ffbf00] text-[#ffbf00] hover:text-neutral-800 rounded">
          {
            loading ? "Loading..." : "Submit"
        }
        </button>
      </form>

    </div>
  );
};

export default Profile;
