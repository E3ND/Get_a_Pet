import { createContext } from "react"

import useAuth from "../hooks/useAuth"

const Context = createContext()

function UserProvider({ children }) {
    // Criando contexto, para que toda vez que seja acessado o contexto ele pegue o register
    const { register } = useAuth()

    return (
        <Context.Provider value={{ register }}>
            {children}
        </Context.Provider>
    )
}

export { Context,  UserProvider }