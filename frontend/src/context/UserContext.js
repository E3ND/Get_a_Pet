import { createContext } from "react"

import useAuth from "../hooks/useAuth"

const Context = createContext()

function UserProvider({ children }) {
    // Criando contexto, para que toda vez que seja acessado o contexto ele pegue o register
    const { authenticated, register, logout, login } = useAuth()

    return (
        <Context.Provider value={{ authenticated, register, logout, login }}>
            {children}
        </Context.Provider>
    )
}

export { Context,  UserProvider }