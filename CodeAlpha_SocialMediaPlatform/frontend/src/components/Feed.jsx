import { FaRegHeart } from "react-icons/fa6"
import Nav from "./Nav"
import Post from "./Post"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
const Feed = () => {
  const { postData } = useSelector(state => state.posts)
  const navigate = useNavigate();

  const handleGoToPageTwo = (userName) => {
    // 1. Get the current scroll container
    const scrollContainer = document.querySelector('.overflow-y-auto');
    const currentScroll = scrollContainer ? scrollContainer.scrollTop : 0;

    // 2. Pass that exact scroll position to the next page inside the state object
    navigate(`/profile/${userName}`, {
      state: { savedScrollPosition: currentScroll }
    });
  };
  useEffect(() => {
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (!scrollContainer) return;

    // Check if we came back with a saved position coordinate
    const targetScroll = location.state?.returnScrollPosition;

    if (targetScroll !== undefined) {
      // If your page loads asynchronous data, wait a tiny split second for data rows to render
      const timer = setTimeout(() => {
        scrollContainer.scrollTo(0, targetScroll);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // If it's a fresh visit, snap to the absolute top
      scrollContainer.scrollTo(0, 0);
    }
  }, [location.state]); // Re-run whenever the navigation state alters

  return (
    <div className='lg:w-[50%] w-full lg:h-[100vh] relative text-[black] bg-[Black] border-r-2 border-gray-900 lg:overflow-y-auto'>
      <div className='w-full h-[100px] flex items-center justify-between lg:hidden'>
        <a href='/'><img className='mt-8 ml-4 cursor-pointer w-[200px]' src='/Chugli_trans3.png' alt='Chugli' /></a>
        <a href='/'><FaRegHeart className='mt-1 mr-6 text-white h-[25px] w-[25px]' /></a>
      </div>
      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[14px] lg:gap-[20px] p-[10px] lg:pt-[40px] pt-[5px] bg-white rounded-t-[30px] relative pb-[120px]">
        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
        <Nav />
      </div>
    </div>
  )
}

export default Feed
