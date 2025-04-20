import { apiService } from './apiService';

export const userService = {

    getProfile: () =>
        apiService.get('/user/profile'),

    getTrans: () =>
        apiService.get('/user/transactions'),

    withdraw: (amount: number) =>
        apiService.post('/user/withdraw', { amount })

};