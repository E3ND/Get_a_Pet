import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import api from '../../../utils/api'

import Petform from '../../form/PetForm'

import styles from './AddPet.module.css'

//Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

function EditPet() {
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()

    //Pegando o id da URL
    const { id } = useParams()

    useEffect(() => {
        const data = api.get(`/pets/${id}`, {
            Authorization: `Bearer ${JSON.parse(token)}`
        }).then((response) => {
            setPet(response.data.pet)
        })
        console.log(pet)
    }, [token, id])

    async function updatePet(pet) {
        let msgType = 'success'

        const formData = new FormData()
        
        await Object.keys(pet).forEach((key) => {
            if(key === 'images') {
                for(let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        const data = await api.patch(`pets/${pet._id}`, formData, {
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
    }

    return(
        <section>
            <div className={styles.addpet_header}>
                <h1>Editando o Pet: {pet.name}</h1>
                <p>Depois da edição os dados serão atualizados no sistema</p>
            </div>
            {pet.name && (
                <Petform 
                    handleSubmit={updatePet} 
                    btnText='Atualizar'
                    petData={pet}
                />
            )}
        </section>
    )
}

export default EditPet