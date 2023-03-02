import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import styles from '../styles/UserName.module.css'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../utils/utils'

const Recovery = () => {

  const {userName} = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState()
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(userName)
      .then((OTP) => {
        if(OTP) return toast.success('OTP has been sent to your email!')
        return toast.error('Problem in OTP generation')
      })
  }, [userName])

  const onSubmit = async(e) => {
    e.preventDefault();
    try {
      let {status} = await verifyOTP({ userName, code: OTP })
      if(status === 201) {
        toast.success('Verified')
        return navigate('/reset')
      }
    } catch (error) {
       return toast.error('Wrong OTP!')  
    }
    
  }

  const resendOTP = () => {
    let sendPromise = generateOTP(userName);
    toast.promise(sendPromise, {
      loading: 'Sending OTP',
      success: <b>OTP has been sent to your email!</b>,
      error: <b>Could not send it!</b>
    })
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password
            </span>
          </div>
          
          <form className="pt-20" onSubmit={onSubmit}>
            <div className="flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter the 6 digit OTP sent to your email address
                </span>
                <input type="text" placeholder="OTP" className={styles.textbox} onChange={(e) => setOTP(e.target.value)} />
              </div>
              <button className={styles.btn} type="submit">Reset</button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">Can't get OTP? <button onClick={resendOTP} className="text-red-500">Resend</button></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Recovery