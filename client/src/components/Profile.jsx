import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast, Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'

import avatar from '../assets/profile.png'
import styles from '../styles/UserName.module.css'
import extend from '../styles/Profile.module.css'
import { profileValidate } from "../utils/validate"
import convertToBase64 from '../utils/convert'
import { useAuthStore } from '../store/store'
import {useFetch} from '../hooks/fetchHook'
import { updateUser } from "../utils/utils"

const Profile = () => {

  const [file, setFile] = useState('')
  const [{ isLoading, apiData, serverError }] = useFetch()
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values)
      toast.promise(updatePromise, {
        success: <b>Updated</b>,
        loading: 'Updating...',
        error: <b>Something went wrong</b>
      })
    }
  });

  /* formik doesn't support file upload */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64)
  }

  /** Logout handler */
  const logOut = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if(isLoading) return <div className="text-2xl text-bold">Loading...</div>
  if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: '45%' }}>
          <div className="flex flex-col justify-center items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can update the details
            </span>
          </div>
          
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex flex-col items-center gap-2 py-4">
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} alt="avatar" className={`${styles.profile_img} ${extend.profileImg}`} />
              </label>
              {file || apiData?.profile ? "" : <span className="text-gray-500 text-sm ">Change Photo</span>}
              <input type="file" id='profile' name="profile" onChange={onUpload}/>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('firstName')} type="text" placeholder="First Name" className={`${styles.textbox} ${extend.textbox}`} />
                <input {...formik.getFieldProps('lastName')} type="text" placeholder="Last Name" className={`${styles.textbox} ${extend.textbox}`} />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('mobile')} type="text" placeholder="Mobile Number" className={`${styles.textbox} ${extend.textbox}`} />
                <input {...formik.getFieldProps('email')} type="text" placeholder="Email Address" className={`${styles.textbox} ${extend.textbox}`} />
              </div>
                <input {...formik.getFieldProps('address')} type="text" placeholder="Address" className={styles.textbox} />
                <button className={styles.btn} type="submit">Update</button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">Come back later? <button className="text-red-500" onClick={logOut} >Logout</button></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile