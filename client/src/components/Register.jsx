import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'

import avatar from '../assets/profile.png'
import styles from '../styles/UserName.module.css'
import { registerValidate } from "../utils/validate"
import convertToBase64 from '../utils/convert'
import { registerUser } from "../utils/utils"

const Register = () => {

  const [file, setFile] = useState('')
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: 'example@gmail.com',
      userName: 'example123',
      password: 'example@123'
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' })
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Registered Successfully</b>,
        error: <b>Couldn't Register</b>
      })
      registerPromise.then(() => navigate('/'))
    }
  });

  /* formik doesn't support file upload */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64)
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: '45%', height: '82%' }}>
          <div className="flex flex-col justify-center items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>
          
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex flex-col items-center gap-2 py-4">
              <label htmlFor="profile">
                <img src={file || avatar} alt="avatar" className={styles.profile_img} />
              </label>
                {file ? "" : <span className="text-gray-500 text-sm ">Upload Photo</span>}
              <input type="file" id='profile' name="profile" onChange={onUpload}/>
            </div>
            <div className="flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} type="text" placeholder="Email address" className={styles.textbox} />
              <input {...formik.getFieldProps('userName')} type="text" placeholder="User Name" className={styles.textbox} />
              <input {...formik.getFieldProps('password')} type="password" placeholder="Password" className={styles.textbox} />
              <button className={styles.btn} type="submit">Sign up</button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">Already a User? <Link className="text-red-500" to="/">Sign in</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register