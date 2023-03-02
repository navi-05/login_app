import { Link, useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'

import avatar from '../assets/profile.png'
import styles from '../styles/UserName.module.css'
import { passwordValidate } from "../utils/validate"
import {useFetch} from '../hooks/fetchHook'
import {useAuthStore} from '../store/store'
import { loginUser } from '../utils/utils'

const Password = () => {

  const {userName} = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${userName}`)
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let loginPromise = loginUser({ userName, password: values.password })
      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Logged In!</b>,
        error: <b>Password doesn't match</b>
      })
      loginPromise.then(res => {
        let { token } = res.data
        localStorage.setItem('token', token)
        navigate('/profile')
      })
    }
  });

  if(isLoading) return <div className="text-2xl text-bold">Loading...</div>
  if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello {apiData?.firstName || apiData?.userName }</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={apiData?.profile || avatar} alt="avatar" className={styles.profile_img} />
            </div>
            <div className="flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} type="password" placeholder="Password" className={styles.textbox} />
              <button className={styles.btn} type="submit">Sign in</button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">Forgot Password? <Link className="text-red-500" to="/recovery">Recover Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Password