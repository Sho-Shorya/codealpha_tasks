import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { toast } from "sonner";
import { fetchPosts } from "../hooks/getAllPost";
import { FiEdit } from "react-icons/fi";
import { Loader2 } from "lucide-react";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)
  const { postData } = useSelector(state => state.posts);

  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [backendMedia, setBackendMedia] = useState(null);
  const dispatch = useDispatch()
  useEffect(() => {
    const post = postData.find(p => p._id === postId);

    if (post) {
      setCaption(post.caption);
      setPreview(post.media);
    }
  }, [postId, postData]);

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setBackendMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("caption", caption);

      if (backendMedia) {
        formData.append("media", backendMedia);
      }

      await axios.put(
        `${API_BASE_URL}/api/post/edit/${postId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPosts(dispatch);
      toast.success("Post Updated");

      navigate(`/profile/${JSON.parse(localStorage.getItem("user")).userName}`);

    } catch (err) {
      toast.error("Failed");
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">

      <div className="bg-white text-[black] rounded-xl p-5 w-[400px]">

        <div className="relative w-full h-full rounded-xl overflow-hidden">

          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          <label
            htmlFor="media"
            className="
    absolute
    top-1/2
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
    w-16
    h-16
    bg-black/80
    hover:bg-black
    rounded-full
    flex
    items-center
    justify-center
    cursor-pointer
    transition-all
    duration-200
  "
          >
            <FiEdit size={28} className="text-white" />
          </label>

          <input
            id="media"
            type="file"
            hidden
            onChange={handleFile}
          />

        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border p-2 mt-4"
        />
        <div className="w-full flex items-center justify-center">
          <button onClick={handleUpdate} className="flex justify-center items-center px-[10px] w-[50%] max-w-
           [100px]  py-[5px] h-[50px] text-[black] bg-[white] mt-[30px] lg:mt-[10px] cursor-pointer
          rounded-2xl">
            {loading ? <Loader2 className='size-7 animate-spin' /> : "Save Changes"}
          </button>
        </div>

      </div>

    </div>
  );
};

export default EditPost