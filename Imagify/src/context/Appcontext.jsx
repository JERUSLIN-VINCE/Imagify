import { createContext,useEffect,useState} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();
const AppContextProvider = (props)=>{
      const[user,setUser]=useState(null);
      const[showLogin,setShowLogin]=useState(false);
      const [token,setToken]=useState(localStorage.getItem('token'));
      const [credit,setCredit]=useState(0);

      const backendUrl=import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const navigate=useNavigate();
      const loadCreditData=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/users/credits',{headers:{token}})
            if(data.success){
              setCredit(data.credits);
              setUser(data.user);
            }
        }
        catch(error){
          console.log(error);
          if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to load credit data");
          }
        }
      }
      const logout=()=>{
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
      }
      const generateImage=async(prompt)=>{
        try{
            const{data}=await axios.post(backendUrl+'/api/image/generate-image'
              ,{prompt},{headers:{token}});
            if(data.success){
              loadCreditData();
              return data.resultImage;
            }
            else{
              toast.error(data.message);
              loadCreditData();
              if(data.creditBalance===0){
                   navigate('/buy');
            }}
        }
        catch(error){
          toast.error(error.message);
        }
      }
      useEffect(()=>{
        if(token){
          loadCreditData();
        }

      },[token])


      const value={user,setUser,showLogin,setShowLogin,backendUrl,
        token,setToken,credit,setCredit,loadCreditData,logout,generateImage};
      return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
      )
}
export default AppContextProvider