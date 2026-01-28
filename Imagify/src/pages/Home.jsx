import React from 'react'
import Header from '../components/Header.jsx'
import Steps from '../components/Steps.jsx'
import Description from '../components/Description.jsx'
import Testimonials from '../components/Testimonials.jsx'
import GenerateBin from '../components/GenerateBin.jsx'
const Home = () => {
  return (
    <div >
      <Header/>
      <Steps/>
      <Description/>
      <Testimonials/>
      <GenerateBin/>
    </div>
  )
}

export default Home