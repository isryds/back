import { createBrowserRouter,Navigate} from 'react-router-dom'
import { lazy } from 'react'
const router = createBrowserRouter([
{
  path: '/layout',
  Component: lazy(()=>import('@/pages/Layout')) ,
  children: [
    {
      path: 'usersbasic',
      Component: lazy(()=>import('@/pages/context/UsersManage/UsersBasic')),
    }, {
      path: 'usersgroup',
      Component: lazy(()=>import('@/pages/context/UsersManage/UsersGroup')),
    }, {
      path: 'uesrstiezi',
      Component: lazy(()=>import('@/pages/context/UsersManage/UsersTiezi')),
    },
  ],
},
{
  path: '/',
  Component: lazy(()=>import('@/pages/Login')) ,
},
{
  path: '*',
  Component: lazy(()=>import('@/components/NotFound')) ,
},
])

export default router