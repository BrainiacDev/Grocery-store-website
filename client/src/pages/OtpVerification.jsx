import React, { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/axiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);

  const navigate = useNavigate();
    const inputRef = useRef([]);
    const location = useLocation()
    console.log("Location", location)

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    },[])

  const validValue = data.every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.verify_otp,
        data: {
            otp: data.join(""),
            email: location?.state?.email
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.message && !response.data.error) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
          navigate("/reset-password", {
              state: {
                  data: response.data,
                  email: location?.state?.email
            }
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
        <p className="font-semibold text-lg">Enter OTP</p>

        <form action="" className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp">Enter your OTP: </label>
            <div className="flex items-center justify-between gap-2 mt-3">
              {data.map((element, index) => {
                return (
                  <input
                    key={"otp" + index}
                    type="text"
                    id="otp"
                    ref={(ref) => {
                      inputRef.current[index] = ref;
                      return ref;
                    }}
                    value={data[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log("Value", value);
                      const newData = [...data];
                      newData[index] = value;
                      setData(newData);
                      if (value && index < 5) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    maxLength={1}
                    className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-[#ffbf00] text-center font-semibold"
                  />
                );
              })}
            </div>
          </div>

          <button
            disabled={!validValue}
            className={`${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide cursor-pointer`}
          >
            Verify OTP
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

export default OtpVerification;
