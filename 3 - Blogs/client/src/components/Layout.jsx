import Header from "./Header"
import {Outlet} from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'

export default function Layout() {
  return (
    <>
        <main>
            <Header />
            {/* child content */}
            <Outlet /> 
            <ToastContainer />
        </main>
    </>
  )
}
