import axios from 'axios';

// C# api connection
const API = axios.create({
    baseURL: 'https://localhost:7188/api'
});

// Transaction
export const getTransactions  = ()       => API.get('/transaction');
export const getTransaction   = (id)     => API.get(`/transaction/${id}`);
export const createTransaction = (data)  => API.post('/transaction', data);
export const updateTransaction = (id, data) => API.put(`/transaction/${id}`, data);
export const deleteTransaction = (id)    => API.delete(`/transaction/${id}`);

// Categories
export const getCategories    = ()       => API.get('/category');
export const createCategory   = (data)   => API.post('/category', data);
export const updateCategory   = (id, data) => API.put(`/category/${id}`, data);
export const deleteCategory   = (id)    => API.delete(`/category/${id}`);

//Budgets
export const getBudgets       = ()       => API.get('/budget');
export const createBudget     = (data)   => API.post('/budget', data);
export const updateBudget     = (id, data) => API.put(`/budget/${id}`, data);
export const deleteBudget     = (id)    => API.delete(`/budget/${id}`);