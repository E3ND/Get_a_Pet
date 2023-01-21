import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../../utils/api'

import styles from './AddPet.module.css'

//Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

//componentes
import PetForm from '../../form/PetForm'


function AddPet() {
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()
    const navigate = useNavigate()
    
    async function registerPet(pet) {
        let msgType = 'success'

        const formData = new FormData()

        // Setando images, quando vem mais de um
        await Object.keys(pet).forEach((key) => {
            if(key === 'images') {
                for(let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        // Criando pet
        const data = await api.post('pets/create', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            msgType = 'error'
            return error.response.data
        })

        setFlashMessage(data.message, msgType)

        if(msgType !== 'error') {
            navigate('/pet/mypets')
        }
    }

    return(
        <section className={styles.addpet_header}>
            <div>
                <h1>Adicionar um pet</h1>
                <p>Depois ele ficará disponível para adoção</p>
            </div>
            <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />
        </section>
    )
}

export default AddPet