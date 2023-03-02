
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token')
    if(!token) return <Navigate to={'/'} replace={true} />
    return children
}

export const ProtectRoute = ({ children }) => {
    const userName = useAuthStore.getState().auth.userName
    if(!userName) return <Navigate to={'/'} replace={true} />
    return children
}