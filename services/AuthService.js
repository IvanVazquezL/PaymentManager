import axios from 'axios';

class AuthService {
    constructor() {}

    async login(username, password) {
        try {
            const response = await axios.post(`${process.env.BASE_URL}login`, {
                username: username,
                password: password
            });

            return response.data;
        } catch (error) {
            console.error('\nLogin failed');
        }
    }
}

export default AuthService;