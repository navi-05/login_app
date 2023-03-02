import { createBrowserRouter, RouterProvider } from 'react-router-dom'

/* import all components */
import UserName from './components/UserName'
import Password from './components/Password'
import PageNotFound from './components/PageNotFound'
import Profile from './components/Profile'
import Recovery from './components/Recovery'
import Register from './components/Register'
import Reset from './components/Reset'

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'

/* root routes */
const router = createBrowserRouter([
  {
    path: '/',
    element: <UserName />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/password',
    element: <ProtectRoute><Password /></ProtectRoute>
  },
  {
    path: '/profile',
    element: <AuthorizeUser><Profile /></AuthorizeUser>
  },
  {
    path: '/recovery',
    element: <Recovery />
  },
  {
    path: '/reset',
    element: <Reset />
  },
  {
    path: '*',
    element: <PageNotFound />
  },

])

const App = () => {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  )
}

export default App