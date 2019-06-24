import axios from 'axios';
import Commom from './common';

const Api = {
    getPortfolios() {
        return axios.post('/api/getPortfolios')
    },
    getTransactionsByPortfolio(portfolioNo, selectedDate) {
        console.log(selectedDate)
        return axios.post('/api/getTransactionsByPortfolio',
            {
                portfolioId: portfolioNo,
                date: Commom.formatDateForServiceReq(selectedDate)
            });
    }
}


export default Api;