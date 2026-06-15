import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import userLogo from '../assets/user.jpeg'
import { toast } from "sonner"
import axios, { Axios } from "axios"
import { setUser } from "@/redux/userSlice"
import { API_BASE_URL } from '@/lib/constants'


const Profile = () => {
  const { user } = useSelector(store => store.user)

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role,
  })
  const [file, setFile] = useState(null);
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    const accessToken = localStorage.getItem('accessToken')
    try {
      //use formData for text+file
      const formData = new FormData()
      formData.append('firstName', updateUser.firstName)
      formData.append('lastName', updateUser.lastName)
      formData.append('email', updateUser.email)
      formData.append('phoneNo', updateUser.phoneNo)
      formData.append('address', updateUser.address)
      formData.append('city', updateUser.city)
      formData.append('zipCode', updateUser.zipCode)
      formData.append('role', updateUser.role)

      if (file) {
        formData.append("file", file) //image file for backend muler
      }
      const res = await axios.put(
        `${API_BASE_URL}/api/v1/user/update/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )


      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data, user))
      }
    } catch {
      toast.error("Failed to update profile")


    }

  }
  return (
    <div className='pt-20 min-h-screen bg-gray-100 flex justify-center '>
      <Tabs defaultValue="profile" className="max-w-5xl ">
        <TabsList>
          <TabsTrigger className='text-[16px] cursor-pointer ' value="profile">Profile</TabsTrigger>
          <TabsTrigger className='text-[16px] cursor-pointer ' value="order">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div >
            <div className='flex flex-col justify-center items-center bg-gray-100'>
              <h2 className='font-bold mb-7 text-gray-800 text-xl'>Update Profile</h2>
              <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'>
                {/* profile-picture */}
                <div className='flex flex-col justify-center items-center mt-5 min-w-[160px] ' >
                  <img src={updateUser?.profilePic || userLogo} alt='pfp' className='h-22 w-22 p-[2px]  rounded-full object-cover border-3 border-emerald-400' />
                  <label className='mt-4 w-auto text-[16px] cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald'>
                    Change Picture
                    <input type="file" accept='image/*' className='hidden' onChange={handleFileChange} />
                  </label>
                </div>
                {/* profile from */}
                <form onSubmit={handleSubmit} className='space-y-1 shadow-lg p-5 rounded-lg bg-white'>
                  <div className='grid grid-cols-2 gap-1'>
                    <div>
                      <label className=' text-[16px] font-md'>First Name</label>
                      <input className='w-full text-[16px] border rounded-lg px-3 py-2 mt-1'
                        type='text'
                        name='firstName'
                        value={updateUser.firstName}
                        onChange={handleChange}
                        placeholder='john' />
                    </div>
                    <div>
                      <label className=' text-[16px] font-md'>Last Name</label>
                      <input className='w-full text-[16px] border rounded-lg px-3 py-2 mt-1' value={updateUser.lastName}
                        onChange={handleChange} type='text' name='lastName' placeholder='doe' />
                    </div>
                  </div>
                  <div>
                    <label className=' text-[16px] font-md'>Email</label>
                    <input className='w-full text-[16px] border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed' value={updateUser.email}
                      onChange={handleChange} type='email' disabled name='email' />
                  </div>
                  <div>
                    <label className=' text-[16px] font-md'>Phone Number</label>
                    <input className='w-full text-[16px] border rounded-lg px-3 py-2 mt-1' value={updateUser.phoneNo}
                      onChange={handleChange} type='text' placeholder='Enter your Contact Number' name='phoneNumber' />
                  </div>
                  <div>
                    <label className=' text-[16px] font-md'>Address</label>
                    <input className='w-full text-[16px] border rounded-lg px-3 py-2 mt-1' value={updateUser.address}
                      onChange={handleChange} type='text' placeholder='Enter your address' name='address' />
                  </div>
                  <div className='grid grid-cols-2 gap-1'>
                    <div>
                      <label className=' text-[16px] font-md'>City</label>
                      <input className='w-full text-[16px] border rounded-lg px-3 py-2 mt-1' value={updateUser.city}
                        onChange={handleChange} type='text' placeholder='Enter your city' name='city' />
                    </div>
                    <div>
                      <label className=' text-[16px] font-md'>Zipcode</label>
                      <input className='w-full text-[16px] border rounded-lg px-3 py-2 mt-1' value={updateUser.zipCode}
                        onChange={handleChange} type='text' placeholder='Enter your zipcode' name='zipcode' />
                    </div>
                  </div>

                  <button type="submit" className='text-[16px] w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg'  >Update Profile</button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="order">

        </TabsContent>


      </Tabs>
    </div>
  )
}

export default Profile