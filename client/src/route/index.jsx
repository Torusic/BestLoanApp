import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../component/Home.jsx";
import Register from "../AuthPages/Register.jsx";
import Login from "../AuthPages/Login.jsx";
import AdminStats from "../DashBoard/AdminStats.jsx";
import AdminDashboard from "../DashBoard/pages/AdminDashboard.jsx";
import Customers from "../DashBoard/pages/Customers.jsx";

const router=createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[{
            path:"",
            element:<Home/>
        },{
            path:'register',
            element:<Register/>
        },
        {
            path:'login',
            element:<Login/>
        },
        {
            path:'adminStats',
            element:<AdminStats/>,
            children:[{
                path:'adminDashboard',
                element:<AdminDashboard/>
            },
            {
                path:'customers',
                element:<Customers/>
            }
        ]
        }
    ]
    }
])
export default router;