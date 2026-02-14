import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // Get token from headers - check both 'token' and 'authorization' headers
  let token = req.headers.token || req.headers.authorization;
  
  // If using Bearer token, extract the token part
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  
  // Check if token is provided
  if(!token){
    return res.status(401).json({success:false, message:"Authentication required. Please login."});
  }
  
  // Use default secret - try both secrets for verification
  const defaultSecret = 'default-secret-key';
  const envSecret = process.env.JWT_SECRET;
  
  let tokenDecode;
  let verified = false;
  
  // Try to verify with environment secret first, then default
  if (envSecret) {
    try {
      tokenDecode = jwt.verify(token, envSecret);
      verified = true;
    } catch (e) {
      console.log("Token verification with env secret failed, trying default");
    }
  }
  
  if (!verified) {
    try {
      tokenDecode = jwt.verify(token, defaultSecret);
      verified = true;
    } catch (e) {
      console.log("Token verification with default secret also failed");
    }
  }
  
  if(verified && tokenDecode && tokenDecode.id){
    req.userId=tokenDecode.id;
    next();
  }
  else{
    return res.status(401).json({success:false, message:"Invalid token. Please login again."});
  }
}

export default userAuth;
