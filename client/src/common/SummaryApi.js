export const baseURL = "https://bestloanapp.onrender.com";

const SummaryApi={
    register:{
        url:'/api/user/register',
        method:"post"
    },
    login:{
        url:'/api/user/login',
        method:"post"
    },
    getStats:{
        url:'/api/user/admin/adminStats',
        method:'get'
    },
    getAllLoans:{
         url:'/api/loan/admin/getAllLoans',
        method:'get'

    },
    applyLoanForCustomer:{
        url:'/api/loan/agent/apply',
        method:"post"
    }

      
}
export default SummaryApi;