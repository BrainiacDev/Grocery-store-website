import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/axiosToastError";
import { Link,useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

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
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return
      }

      if (response.data.message && !response.data.error) {
          toast.success(response.data.message);
          navigate("/verification-otp", {
              state: data
        });
        setData({
          email: "",
        });
          
      }
      console.log("Response", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Forgot password</p>

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

          <button
            disabled={!validValue}
            className={`${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide cursor-pointer`}
          >
            Send OTP
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

export default ForgotPassword;
