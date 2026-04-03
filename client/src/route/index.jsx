import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../component/Home.jsx";
import Register from "../AuthPages/Register.jsx";
import Login from "../AuthPages/Login.jsx";
import AdminStats from "../DashBoard/AdminStats.jsx";
import AdminDashboard from "../DashBoard/pages/AdminDashboard.jsx";
import Customers from "../DashBoard/pages/Customers.jsx";
import Loan from "../DashBoard/pages/Loan.jsx";
import ClientStats from "../DashBoard/ClientStats.jsx";
import ClientDashboard from "../DashBoard/pages/ClientDashboard.jsx";
import ApplyLoan from "../DashBoard/pages/actions/ApplyLoan.jsx";

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
                path:'loans',
                element:<Loan/>
            },
            {
                path:'customers',
                element:<Customers/>
            }
        ]
        },
        {
            path:'clientStats',
            element:<ClientStats/>,
            children:[{
                path:"clientDashboard",
                element:<ClientDashboard/>
            },{
            path:"apply",
            element:<ApplyLoan/>
        }
        ]
        }

    ]
    }
])
export default router;