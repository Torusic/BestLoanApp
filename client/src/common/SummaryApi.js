export const baseURL = "https://bestloanapp.onrender.com";
//export const baseURL = "http://localhost:5000";

const SummaryApi = {
  // AUTH
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },

  // ADMIN
  getStats: {
    url: "/api/user/admin/adminStats",
    method: "get",
  },
  getAllLoans: {
    url: "/api/loan/admin/getAllLoans",
    method: "get",
  },
  addAgent: {
    url: "/api/user/admin/addAgent",
    method: "post",
  },
  myClients: {
    url: "/api/user/admin/allClients",
    method: "get",
  },
  getAllAgents: {
    url: "/api/user/admin/allAgents",
    method: "get",
  },

  // LOANS (CLIENT)
  apply: {
    url: "/api/loan/apply",
    method: "post",
  },
  myLoan: {
    url: "/api/loan/activeLoan",
    method: "get",
  },
  loanHistory: {
    url: "/api/loan/history",
    method: "get",
  },

  // PROCESSING FEES
  submitProcessingFee: {
    url: "/api/loan/submit",
    method: "post",
  },
  approve: {
    url: "/api/loan/approve",
    method: "post",
  },
  reject: {
    url: "/api/loan/reject",
    method: "post",
  },
  disburse: { 
    url: "/api/loan/disburse",
    method: "post",
  },

  // AGENT MODULE
  agentRegisterClient: {
    url: "/api/agent/register-client",
    method: "post",
  },
  agentApplyLoan: {
    url: "/api/agent/apply-loan",
    method: "post",
  },
  agentClients: {
    url: "/api/agent/clients",
    method: "get",
  },
  agentClientStatus: {
    url: "/api/agent/client-status",
    method: "get",
  },
  agentDashboard: {
    url: "/api/agent/dashboard",
    method: "get",
  },

  // REPAYMENTS
  submitRepayment: {
    url: "/api/repay/submit",
    method: "post",
  },
  getAllRepayments: {
    url: "/api/repay/all",
    method: "get",
  },
  verifyRepayment: {
    url: "/api/repay/verify",
    method: "post",
  },

  // USER SETTINGS
  getUserSettings: {
    url: "/api/user/user/settings",
    method: "get",
  },
  updateProfile: {
    url: "/api/user/user/update-profile",
    method: "put",
  },
  changePassword: {
    url: "/api/user/user/change-password",
    method: "put",
  },
  toggleNotifications: {
    url: "/api/user/user/toggle-notifications",
    method: "put",
  },

  // MPESA
  makeProcessingFee: {
    url: "/api/mpesa/stkPush",
    method: "post",
  },
};

export default SummaryApi;