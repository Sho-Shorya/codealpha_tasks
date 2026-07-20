import { useState } from "react";
import { ArrowLeft, Check, ImagePlus, Loader2, ThumbsUp, ThumbsUpIcon, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { useEffect } from "react";
import { fetchPosts } from "../hooks/getAllPost";
import { useDispatch } from "react-redux";

function Upload() {

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate()
  const [mediaType, setMediaType] = useState('')
  const [frontendMedia, setFrontendMedia] = useState(null)
  const [backendMedia, setBackendMedia] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();


  const handleFiles = (file) => {
    const uploadedFile = file[0];
    if (file && file.length > 0) {
      setFileName(uploadedFile.name);

      if (uploadedFile.type.includes('image')) {

        setMediaType('image')
        setBackendMedia(uploadedFile)
        setFrontendMedia(URL.createObjectURL(uploadedFile))

      } else {
        toast.error('Please upload an Image')
      }
    }
  };

  const upload = async () => {
    setLoading(true)
    try {
      const formData = new FormData()

      formData.append('caption', caption)
      formData.append('mediaType', mediaType)
      formData.append('media', backendMedia)

      const token = localStorage.getItem('token')
      const res = await axios.post(`${API_BASE_URL}/api/post/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      await fetchPosts(dispatch);
      navigate('/')

    } catch (error) {
      toast.error('Failed to upload media')
      console.log(error);
    } finally {
      setLoading(false)
      toast.success('Media uploaded', { duration: 1000 })

    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <button onClick={() => navigate('/')} className="text-white" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-medium">Upload Media</h1>
      </div>

      {/* Gradient accent banner */}
      <div className="w-full max-w-md mx-auto mb-8 rounded-xl h-20 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center px-5 shadow-lg shadow-purple-900/40">
        <div>
          <p className="text-sm font-semibold leading-tight">Share something new</p>
          <p className="text-xs text-white/80 leading-tight">
            Upload picture
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center">

        {!frontendMedia &&
          <div className="flex justify-center">
            <label
              htmlFor="file-upload"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              className={`w-[300px] max-w-md aspect-[5/4] rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer border-2 border-dashed transition-colors ${isDragging
                ? "border-fuchsia-500 bg-neutral-800"
                : "border-white/15 bg-neutral-900 hover:bg-neutral-800 hover:border-white/25"
                }`}
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-600 flex items-center justify-center">
                {fileName ? <ImagePlus size={20} /> : <UploadCloud size={20} />}
              </span>
              <span className="text-sm font-medium">
                {fileName ? fileName : "Upload post"}
              </span>
              {!fileName && (
                <span className="text-xs text-white/40">
                  Drag and drop or click to browse
                </span>
              )}
            </label>
          </div>
        }

        {frontendMedia &&
          <div className='w-[100%] max-w-[500px] h-[350px] flex flex-col
            items-center justify-center '>
            {mediaType == "image" &&
              <div className='w-[100%] max-w-[500px] h-[250px]
            flex flex-col items-center justify-center  mt-[3vh] '>
                <img src={frontendMedia} alt="" className='h-[80%] rounded-2xl' />
                <p className="p-5"><Check /></p>
                <div className="flex flex-col lg:flex-row w-full h-full my-[20px] gap-[10px] items-center justify-center">
                  <label className="text-[15px] lg:w-[200px] rounded-lg bg-gray-800 p-2">Enter caption</label>
                  <textarea maxLength={150} onChange={(e) => setCaption(e.target.value)} value={caption} className=' w-full ■border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] ■text-white '
                    placeholder='write caption' />
                </div>
              </div>}
          </div>}
        {frontendMedia &&
          <button onClick={upload} className="flex justify-center items-center px-[10px] w-[50%] max-w-
           [100px]  py-[5px] h-[50px] text-[black] bg-[white] mt-[30px] lg:mt-[10px] cursor-pointer
          rounded-2xl">
            {loading ? <Loader2 className='size-7 animate-spin' /> : "Upload Post"}
          </button>
        }


      </div>
    </div>
  );
}

export default Upload;