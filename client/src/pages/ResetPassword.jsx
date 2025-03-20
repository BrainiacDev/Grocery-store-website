import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AxiosToastError from "../utils/axiosToastError";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  //   console.log("Reset password", location)

  const validValue = Object.values(data).every((el) => el);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (data.newPassword !== data.confirmPassword) {
          toast.error("New password and confirm password must be same")
          return;
      }

    try {
      const response = await Axios({
        ...SummaryApi.reset_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.message && !response.data.error) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
          email: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      console.log("Response", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData((previousValue) => {
        return {
          ...previousValue,
          email: location?.state?.email,
        };
      });
    }
  }, []);

  console.log("Reset data", data);

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Enter Your New Password</p>

        <form action="" className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New password: </label>
            <div className="bg-blue-50 p-2 rounded flex items-center focus-within:border-[#ffbf00]">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your new password"
                value={data.newPassword}
                name="newPassword"
                onChange={handleChange}
                className="w-full outline-none"
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm password: </label>
            <div className="bg-blue-50 p-2 rounded flex items-center focus-within:border-[#ffbf00]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password"
                placeholder="Confirm your password"
                value={data.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                className="w-full outline-none"
              />
              <div
                onClick={() => setShowConfirmPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validValue}
            className={`${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide cursor-pointer`}
          >
            Change password
          </button>
        </form>

        <p>
          Already have account ?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-700"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
