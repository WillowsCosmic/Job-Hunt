import { useState } from 'react'
import './App.css'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home />,
  },
  {
    path:'/login',
    element:<Login />,
  },
  {
    path:'/signup',
    element:<Signup />,
  },
  // {
  //   path:'/',
  //   element:<Home />,
  // },
  // {
  //   path:'/',
  //   element:<Home />,
  // },
])

function App() {

  return (
    <>
      <RouterProvider router ={appRouter} />

    </>
  )
}

export default App
