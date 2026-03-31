import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
export const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.accessToken|| req?.headers?.authorization?.split(" ") [1];
        
        if(!token){
        return res.status(401).json({
            message:"Provide Token",
            error: true,
            success:false
        })
       }
       const decode= await jwt.verify(token,process.env.ACCESS_TOKEN);

       if(!decode){
        return res.status(401).json({
            message:"Unauthorized access",
            error:true,
            success:false
        })
       }
       req.userId=decode.id;
       next();


    }catch(error){
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      // fetch user from DB using req.userId
      const user = await UserModel.findById(req.userId).select("role");

      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      });
    }
  };
};
