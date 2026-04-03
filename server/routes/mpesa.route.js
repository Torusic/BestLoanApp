import { Router } from "express";
import { auth, authorizeRoles } from "../middleware/auth.js";
import { makeProcessingFee, mpesaCallback } from "../conntrollers/mpesa.controeller.js";
import generateToken from "../middleware/mpesaAuth.js";


const mpesaRoute=Router()

mpesaRoute.post('/stkPush',auth ,generateToken,authorizeRoles('client'),makeProcessingFee)
mpesaRoute.post('/callback',mpesaCallback)

export default mpesaRoute