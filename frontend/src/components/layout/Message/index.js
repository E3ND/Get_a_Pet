import { useEffect, useState } from 'react'
import bus from '../../../utils/bus'

import styles from './styles.module.css'

function Message() {
    const [visibility, setVisibility] = useState(false)
    const [message, setMessage] = useState(false)
    const [type, setType] = useState('')

    useEffect(() => {
        // Quando tiver um evento que chame a flash messages
        bus.addListener('flash', ({ message, type }) => {
            setVisibility(true)
            setMessage(message)
            setType(type)

            // Tempo de visibilidade
            setTimeout(() => {
                setVisibility(false)
            }, 3000)
        })
    }, [])

    return(
        visibility && (
            <div className={`${styles.message} ${styles[type]}`}>
                {message}
            </div>
        )
    )
}

export default Message