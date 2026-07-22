import { LucideImage } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import { MdClose, MdOutlineClose, MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../lib/constants'
import { toast } from 'sonner'
import { setMessages } from '../redux/messageSlice'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
const MessageArea = () => {
  const { selectedUser, messages } = useSelector(state => state.message)
  const { userData } = useSelector(state => state.user)
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const imageInput = useRef()
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  const handleRemoveImg = (e) => {
    setBackendImage('')
    setFrontendImage('')
  }
  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}/api/message/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setMessages([...messages, res.data]));
      setInput("");
      setBackendImage(null);
      setFrontendImage(null);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllMessages = async () => {
    try {
      console.log("Fetching messages...");
      const res = await axios.get(
        `${API_BASE_URL}/api/message/getallmess/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("API Response:", res.data);
      dispatch(setMessages(res.data ? [...res.data] : []));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedUser) {
      navigate("/", { replace: true });
    }
    getAllMessages();

  }, [selectedUser, navigate]);

  return (
    <div className="w-full h-screen bg-black relative">

      {/* Header */}
      <div className="fixed top-0 left-0 w-full h-[80px] bg-black border-b border-gray-800 flex items-center px-5 z-50">

        {/* Back Button */}
        <MdOutlineKeyboardBackspace
          onClick={() => navigate("/")}
          className="text-white w-7 h-7 cursor-pointer hover:text-gray-300"
        />

        {/* User */}
        <div className="flex items-center ml-5 gap-4">

          <div className="w-10 h-10  rounded-full overflow-hidden border border-gray-700">
            <img
              src={selectedUser?.profilePic || "/empty_dp.jpg"}
              alt={selectedUser?.userName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg">
              {selectedUser?.userName}
            </h2>

            <p className="text-gray-400 text-sm">
              {selectedUser?.name}
            </p>
          </div>

        </div>


      </div>
      <div className='w-full h-[90%] pt-[100px]  lg:pb-[150px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-black'>
        {messages &&
          messages.map((mess, index) =>
            mess.sender == userData._id ? (
              <SenderMessage key={index} message={mess} />
            ) : (
              <ReceiverMessage key={index} message={mess} />
            )
          )}
      </div>

      <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]'>
        <form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative'>
          {frontendImage && <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
            <img src={frontendImage} alt="" className='h-full object-cover' />
            <span onClick={handleRemoveImg} className='rounded-full flex items-center justify-center text-white absolute top-1 right-1  bg-red-600 h-6 w-6'><MdOutlineClose color='white' /></span>
          </div>}

          <input onChange={handleImage} type='file' accept='image/*' hidden ref={imageInput} />
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder='Message' className='w-full h-full px-[20px] text-[18px] text-white outline-0' />
          <div onClick={() => imageInput.current.click()}><LucideImage className='w-[28px] h-[28px] text-white' /></div>
          {(input || frontendImage) && <button onClick={handleSendMessage} className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center'><IoMdSend className='w-[25px] h-[25px] text-white' /></button>}
        </form>
      </div>


    </div>
  )
}

export default MessageArea