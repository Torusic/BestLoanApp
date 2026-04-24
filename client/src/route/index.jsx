import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../component/Home.jsx";
import Register from "../AuthPages/Register.jsx";
import Login from "../AuthPages/Login.jsx";

// ================= ADMIN =================
import AdminStats from "../DashBoard/AdminStats.jsx";
import AdminDashboard from "../DashBoard/pages/AdminDashboard.jsx";
import Customers from "../DashBoard/pages/Customers.jsx";
import Loan from "../DashBoard/pages/Loan.jsx";
import VerifyRepayment from "../DashBoard/pages/actions/VerifyRepayment.jsx";
import ViewAllTenants from "../DashBoard/pages/ViewAllTenants.jsx";
import Settings from "../DashBoard/pages/Settings.jsx";

// ================= CLIENT =================
import ClientStats from "../DashBoard/ClientStats.jsx";
import ClientDashboard from "../DashBoard/pages/ClientDashboard.jsx";
import ApplyLoan from "../DashBoard/pages/actions/ApplyLoan.jsx";
import MyLoan from "../DashBoard/pages/MyLoan.jsx";
import History from "../DashBoard/pages/History.jsx";
import AgentDashboard from "../DashBoard/AgentDashboard.jsx";
import RepaymentHistory from "../DashBoard/pages/RepaymentHistory.jsx";
import AgentStats from "../DashBoard/AgentStats.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ================= HOME =================
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },

      // ================= ADMIN ROUTES =================
      {
        path: "adminStats",
        element: <AdminStats />,
        children: [
          {
            index: true,
            element: <AdminDashboard />, // default admin page
          },
          {
            path: "loans",
            element: <Loan />,
          },
          {
            path: "customers",
            element: <Customers />,
          },
          {
            path: "repayments",
            element: <VerifyRepayment />,
          },
          {
            path: "allAgents",
            element: <ViewAllTenants />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },

      // ================= CLIENT ROUTES =================
      {
        path: "clientStats",
        element: <ClientStats />,
        children: [
          {
            index: true,
            element: <ClientDashboard />, // default client page
          },
        
          {
            path: "repayHistory",
            element: <RepaymentHistory />,
          },
          {
            path: "myloan",
            element: <MyLoan />,
          },
          {
            path: "apply",
            element: <ApplyLoan />,
          },
          {
            path: "history",
            element: <History />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
            {
        path: "agentStats",
        element: <AgentStats />,
        children: [
          {
            index: true,
            element: <AgentDashboard />, // default client page
          },
          {
            path: "agentDashboard",
            element: <AgentDashboard />,
          },
          {
            path: "repayHistory",
            element: <RepaymentHistory />,
          },
          {
            path: "myloan",
            element: <MyLoan />,
          },
          {
            path: "apply",
            element: <ApplyLoan />,
          },
          {
            path: "history",
            element: <History />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);

export default router;