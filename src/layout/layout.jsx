import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar/SideBar'

const Layout = () => {
  return (
    <div>
        <SideBar/>
        <main>
          <Outlet/>
        </main>
    </div>
  )
}

export default Layout