import api from '../utils/api'

import { useState, useEffect } from 'react'
import { useNavigate  } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth() {
    // enviando os dados que vem do register para o backend
    const { setFlashMessage } = useFlashMessage()
    const [ authenticated , setAuthenticated ] = useState(false)

    // Verifica se o usuário já está com o token
    useEffect(() => {
        const token = localStorage.getItem('token')

        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }

    }, [])

    // Responsável por redirecionar o usuário
    const navigate = useNavigate()

    //Registrando
    async function register(user) {
        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'

        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch (error) {
            msgText = error.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }

    // Logando
    async function login(user) {
        let msgText = 'Login realizado com sucesso!'
        let msgType = 'success'

        try {
            const data = await api.post('/users/login', user).then((response) => {
                return response.data
            })

            await authUser(data)
        } catch (error) {
            msgText = error.response.data.message
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    // Setando o token no local storage do navegador
    async function authUser(data) {
        setAuthenticated(true)

        localStorage.setItem('token', JSON.stringify(data.token))

        navigate('/')
    }

    function logout() {
        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'success'

        setAuthenticated(false)
        localStorage.removeItem('token')

        api.defaults.headers.Authorization = undefined

        navigate('/')

        setFlashMessage(msgText, msgType)
    }

    return { authenticated, register, logout, login }
}