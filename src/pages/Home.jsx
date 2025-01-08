import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  useEffect(() =>{
      navigate('/user/login')
  },[])
  return (
    <>
    <div className='home-page-of-qr-web'>
    </div>
    
    </>
  )
}

export default Home