import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer.jsx'
import HeroSection from './HeroSection'
import CategoryCaraosal from './CategoryCaraosal'
import LatestJob from './LatestJob'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const {user} = useSelector(store=>store.auth)
  const navigate = useNavigate();
  useEffect(() => {
    if(user?.role==='recruiter'){
      navigate("/admin/companies")
    }
  }, [])
  
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCaraosal />
      <LatestJob />
      <Footer />
    </div>
  )
}

export default Home