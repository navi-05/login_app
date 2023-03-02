import { Link, useNavigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'

import avatar from '../assets/profile.png'
import styles from '../styles/UserName.module.css'
import { userNameValidate } from "../utils/validate"
import { useAuthStore } from "../store/store"

const UserName = () => {

  const setUserName = useAuthStore(state => state.setUserName)
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      userName: ''
    },
    validate: userNameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUserName(values.userName)
      navigate('/password')
    }
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>
            <div className="flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('userName')} type="text" placeholder="Username" className={styles.textbox} />
              <button className={styles.btn} type="submit">Let's Go</button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">Not a Member <Link className="text-red-500" to="/register">Register Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserName