import axios from 'axios';

class BillService {
    constructor() {}

    async createBill(bill, token) {
        try {
            const response = await axios.post(`${process.env.BASE_URL}bills`, bill, {
                headers: {
                    "x-token": token
                }
            });
            return response.data;
        } catch (error) {
            console.error('\nCreation of bill failed');
            console.log(error);
        } 
    }
}

export default BillService;