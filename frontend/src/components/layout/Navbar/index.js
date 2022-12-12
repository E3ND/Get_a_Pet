import { useContext } from 'react'
import { Link } from 'react-router-dom'

//Context
import { Context } from '../../../context/UserContext'

import Logo from '../../../assets/img/logo.png'

import styles from './styles.module.css'

function Navbar() {
    const { authenticated, logout } = useContext(Context)

    return(
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt="Logo Get a Pet" />
                <h2>Get a Pet</h2>
            </div>
            <ul>
                <li>
                    <Link to="/">Adotar</Link>
                </li>
                {authenticated ? (
                        <>
                        <li onClick={logout}>Sair</li>
                        </>
                    ) : 
                    (
                        <>
                        <li>
                            <Link to="/login">Entrar</Link>
                        </li>
                        <li>
                            <Link to="/register">Cadastrar</Link>
                        </li>
                        </>
                    )

                }
            </ul>
        </nav>
    )
}

export default Navbar