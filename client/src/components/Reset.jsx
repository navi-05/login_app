import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { useNavigate, Navigate } from 'react-router-dom'

import styles from '../styles/UserName.module.css'
import { resetPasswordValidate } from "../utils/validate"
import { resetPassword } from '../utils/utils'
import { useAuthStore } from '../store/store'
import { useFetch } from '../hooks/fetchHook'

const Reset = () => {

  const { userName } = useAuthStore(state => state.auth)
  const navigate = useNavigate();
  const [{ isLoading, status, serverError }] = useFetch(`/createResetSession`)


  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
          let resetPromise = resetPassword({ userName, password: values.password })
          toast.promise(resetPromise, {
          loading: 'Updating...',
          success: <b>Reset Successfully..!</b>,
          error: <b>Couldn't Reset</b>
        })
        resetPromise.then(() => {
          navigate('/password')
        })
      } catch (error) {
        toast.error(error)
      }
      
    }
  });

  if(isLoading) return <div className="text-2xl text-bold">Loading...</div>
  if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>
  if(status && status !== 201) return <Navigate to={'/password'} replace={true} />

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new Password
            </span>
          </div>
          
          <form className="pt-20" onSubmit={formik.handleSubmit}> 
            <div className="flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} type="password" placeholder="New Password" className={styles.textbox} />
              <input {...formik.getFieldProps('confirmPassword')} type="password" placeholder="Confirm Password" className={styles.textbox} />
              <button className={styles.btn} type="submit">Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Reset