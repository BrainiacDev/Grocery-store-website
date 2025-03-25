import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/axiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.message && !response.data.error) {
        toast.success(response.data.message);
        localStorage.setItem(
          "accessToken",
          response.data.data.accessToken
        );
        localStorage.setItem(
          "refreshToken",
          response.data.data.refreshToken
        );

        const userDetail = await fetchUserDetails()
        dispatch(setUserDetails(userDetail.data))

        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
      console.log("Response", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p>Welcome to Grocery Store</p>

        <form action="" className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Email: </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={data.email}
              name="email"
              onChange={handleChange}
              className="bg-blue-50 p-2 rounded outline-none focus-within:border-[#ffbf00]"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="name">Password: </label>
            <div className="bg-blue-50 p-2 rounded flex items-center focus-within:border-[#ffbf00]">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={data.password}
                name="password"
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
            <Link
              to={"/forgot-password"}
              className="block ml-auto hover:text-[#ffbf00] pt-2"
            >
              Forgot password ?{" "}
            </Link>
          </div>

          <button
            disabled={!validValue}
            className={`${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide cursor-pointer`}
          >
            Login
          </button>
        </form>

        <p>
          Don't have account ?{" "}
          <Link
            to={"/register"}
            className="font-semibold text-green-700 hover:text-green-700"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
