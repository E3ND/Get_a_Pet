import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

//Context
import { Context } from '../../../context/UserContext'

import Input from '../../form'

import styles from '../../form/Form.module.css'

function Register() {
    const [user, setUser] = useState({})
    const { register } = useContext(Context)

    // Capturando as letras digitadas no forms
    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value })
    }

    //  Executando uma ção após o submit do form
    function handleSubmit(e) {
        e.preventDefault()

        // Enviando dados para o useAuth
        register(user)
    }

    return(
        <section className={styles.form_container}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleChange}
                />
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Confirmação de senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleChange}
                />
                <input type="submit" value="Cadastrar" />
            </form>
            <p>
                Já possui uma conta? <Link to="/login">Clique aqui.</Link>
            </p>
        </section>
    )
}

export default Register