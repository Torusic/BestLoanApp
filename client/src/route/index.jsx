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
import MyLoan from "../DashBoard/pages/MyLoan.jsx";
import History from "../DashBoard/pages/History.jsx";
import AgentDashboard from "../DashBoard/AgentDashboard.jsx";
import VerifyRepayment from "../DashBoard/pages/actions/VerifyRepayment.jsx";
import Settings from "../DashBoard/pages/Settings.jsx";


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
                index:true,
                path:'adminDashboard',
                element:<AdminDashboard/>
            },
            {    index:true,
                path:'loans',
                element:<Loan/>
            },
            {   index:true,
                path:'customers',
                element:<Customers/>
            },
            {
                index:true,
                path:'repayments',
                element:<VerifyRepayment/>
            },
            {
                index:true,
                path:'settings',
                element:<Settings/>
            }
        ]
        },
        {
            path:'clientStats',
            element:<ClientStats/>,
            children:[{
                index:true,
                path:"clientDashboard",
                element:<ClientDashboard/>
            },{
                path:"agentDashboard",
                element:<AgentDashboard/>
            },
            {
                index:true,
                path:"myloan",
                element:<MyLoan/>

            },
            
            {
            path:"apply",
            element:<ApplyLoan/>
        },
        {
            path:"history",
            element:<History/>

        },
          {
                index:true,
                path:'settings',
                element:<Settings/>
            }
        ]
        }

    ]
    }
])
export default router;