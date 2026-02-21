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

      // Dynamic backend URL - uses env variable or derives from current location in production
      const getBackendUrl = () => {
        // Priority 1: Use environment variable if set
        if (import.meta.env.VITE_BACKEND_URL) {
          return import.meta.env.VITE_BACKEND_URL;
        }
        
        // Priority 2: In production, try to derive from current location
        if (window.location.hostname.includes('vercel.app')) {
          const currentOrigin = window.location.origin;
          
          // Try multiple patterns to find the server URL
          // Pattern 1: imagify-xxx -> server-xxx (works for most deployments)
          let backendUrl = currentOrigin.replace(/imagify-([a-z0-9]+)/, 'server-$1');
          
          // If that didn't work, try replacing just "imagify" with "server"
          if (backendUrl === currentOrigin) {
            backendUrl = currentOrigin.replace('imagify', 'server');
          }
          
          // Return the derived URL, but we know it might not work for all alias patterns
          return backendUrl;
        }
        
        // Priority 3: Fallback to localhost for development
        return 'http://localhost:4000';
      };
      
      const backendUrl = getBackendUrl();
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