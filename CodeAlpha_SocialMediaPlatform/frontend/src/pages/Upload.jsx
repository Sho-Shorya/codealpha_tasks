import { useState } from "react";
import { ArrowLeft, ImagePlus, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { useEffect } from "react";

function Upload() {

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate()
  const [mediaType, setMediaType] = useState('')
  const [frontendMedia, setFrontendMedia] = useState(null)
  const [backendMedia, setBackendMedia] = useState(null)
  const [caption, setCaption] = useState('')


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
    try {
      const formData = new FormData()
  
      formData.append('caption', caption)
      formData.append('mediaType', mediaType)
      formData.append('media', backendMedia)
      
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const token = localStorage.getItem('token')
      const res = await axios.post(`${API_BASE_URL}/api/post/upload`,formData ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      navigate('/')
      toast.success('Media uploaded successfully')

    } catch (error) {
      toast.error('Failed to upload media')
      console.log(error);
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
          <div className='w-[100%] max-w-[500px] h-[250px] flex flex-col
            items-center justify-center '>
            {mediaType == "image" &&
              <div className='w-[100%] max-w-[500px] h-[250px]
            flex flex-col items-center justify-center  mt-[5vh] '>
                <img src={frontendMedia} alt="" className='h-[80%] rounded-2xl' />
                <input type='text' onChange={(e) => setCaption(e.target.value)} value={caption} className='w-full ■border-b-gray-400 border-b-2
            outline-none px-[10px] py-[5px] ■text-white mt-[20px]'
                  placeholder='write caption' />
              </div>}
          </div>}
        {frontendMedia &&
          <button onClick={upload} className="mt-20 px-[10px] w-[50%] max-w-
           [100px]  py-[5px] h-[50px] text-[black] bg-[white] mt-[50px] cursor-pointer
          rounded-2xl">Upload Post</button>
        }


      </div>
    </div>
  );
}

export default Upload;