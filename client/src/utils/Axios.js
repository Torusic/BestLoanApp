import axios from "axios";
import { baseURL } from "../common/SummaryApi.js";

const Axios= axios.create({
    baseURL:baseURL,
    withCredentials:true
})
export default Axios;