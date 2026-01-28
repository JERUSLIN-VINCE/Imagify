import React,{useContext} from 'react'
import { assets } from '../../assets/assets'
import {motion} from 'framer-motion'
import { AppContext } from '../context/Appcontext'
import {useNavigate} from 'react-router-dom'

const GenerateBin = () => {
  const {user,setShowLogin}=useContext(AppContext);
    const navigate=useNavigate();
    const onClickHandler = () => {
        if(user){
           navigate('/result');
        }
        else{
            setShowLogin(true);
        }
    }
  return (
    
    <motion.div 
    initial={{opacity:0.2,y:100}} transition={{duration:1}} 
     viewport={{once:true}} whileInView={{opacity:1,y:0}}
    className='pb-16 text-center'>
       <h1 className='text-2xl md:text-3xl lg:text-4xl
       mt-4 font-semibold text-neutral-800 py-6 md:py-16'
       >See the magic. Try now</h1> 
       <button className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-auto hover:scale-105
       transition-all duration-500 shadow-lg hover:shadow-xl' onClick={onClickHandler}>Generate Images
       <img src={assets.star_group} className='h-6'/>
</button>
    </motion.div>
  )
}

export default GenerateBin