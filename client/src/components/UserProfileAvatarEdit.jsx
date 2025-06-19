import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/axios'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/axiosToastError'
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from 'react-icons/io5'

const UserProfileAvatarEdit = ({close}) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const handleUploadAvatarImage = async (e) => { 
    const file = e.target.files[0]

    if (!file) {
      return;
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });

      const { data: responseData } = response
      dispatch(updatedAvatar(responseData.data.avatar))

      // console.log(response);
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }

  }

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-black/60 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        <button onClick={close} className="text-neutral-800 block w-fit ml-auto cursor-pointer">
                      <IoClose size={25}/>
                  </button>
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-700 overflow-hidden drop-shadow-sm">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full" />
          ) : (
            <FaRegUserCircle size={65} />
          )}
        </div>
        <form onSubmit={ handleSubmit }>
          <label htmlFor="uploadProfile">
            <div className="border border-[#ffbf00] hover:bg-[#ffbf00] cursor-pointer px-4 py-1 rounded text-sm my-3">
              {
                loading ? "Loading..." : "Upload"

              }
            </div>
          <input onChange={handleUploadAvatarImage} type="file" id="uploadProfile" className='hidden'/>
          </label>
        </form>
      </div>
    </section>
  );
}

export default UserProfileAvatarEdit