import { FaRegHeart } from "react-icons/fa6"
import Nav from "./Nav"
const Feed = () => {
  return (
    <div className='lg:w-[75%] w-full lg:h-[100vh] relative bg-[Black] border-r-2 border-gray-900 lg:overflow-y-auto'>
      <div className='w-full h-[100px] flex items-center justify-between lg:hidden'>
        <a href='/'><img className='mt-8 ml-4 cursor-pointer w-[200px]' src='/Chugli_trans3.png' alt='Chugli' /></a>
        <a href='/'><FaRegHeart className='mt-1 mr-6 text-white h-[25px] w-[25px]' /></a>
      </div>

      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
        <Nav/>
      </div>
    </div>
  )
}

export default Feed
