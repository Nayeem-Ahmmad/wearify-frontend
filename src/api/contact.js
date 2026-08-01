import api from './axios'

export const sendContactMessage = async (name, email, message) => {
    const response = await api.post('/shop/contact/', { name, email, message })
    return response.data
}
