export const baseURL = "https://bestloanapp.onrender.com";
//export const baseURL = "http://localhost:5000";

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
    addAgent:{
        url:"/api/user/admin/addAgent",
        method:"post"

    },
    applyLoanForCustomer:{
        url:'/api/loan/agent/apply',
        method:"post"
    },
    apply:{
        url:'/api/loan/apply',
        method:"post"

    },
    myLoan:{
        url:"/api/loan/activeLoan",
        method:'get'

    },
        loanHistory:{
        url:"/api/loan/history",
        method:'get'

    },

    myClients:{
        url:"/api/user/admin/allClients",
        method:'get'

    },
    approve:{
        url:"/api/loan/approve",
        method:"post"

    },
        submitProcessingFee:{
        url:"/api/loan/submit",
        method:"post"

    },
        disburse:{
        url:"/api/loan/disburse",
        method:"post"

    },
    makeProcessingFee:{
        url:"/api/mpesa/stkPush",
        method:"post"
    }


      
}
export default SummaryApi;