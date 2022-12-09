const Pet = require('../models/Pet')

// Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {
    static async create(req, res) {
        // Criação do  pet
        const { name, age, weight, color } = req.body

        const images = req.files

        const available = true

        // Validações
        if(!name || !age || !weight || !color || images.length === 0) {
            res.status(422).json({ message: 'Os campos nome, idade, peso, cor e imagens, são obrigatórios!' })
            return
        }

        // Pegando o usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.image,
                phone: user.phone
            },
        })

        // Dando nome para cada imagem vinda do front
        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()

            res.status(201).json({ message: 'Pet cadastrado com sucesso!', newPet })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res) {
        // Buscando todos os pets
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({ pets: pets, })
    }

    static async getAllUserPets(req, res) {
        // Pegando u usuário pelo token
        const token =  getToken(req)
        const user = await getUserByToken(token)

        //Filtrando os pets baseado no id do usuário
        const pets = await Pet.find({ 'user._id': user._id }).sort('createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getAllUserAdoptions(req, res) {
        // Pegando u usuário pelo token
        const token =  getToken(req)
        const user = await getUserByToken(token)

        //Filtrando os pets baseado no id do usuário
        const pets = await Pet.find({ 'adopter._id': user._id }).sort('createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getPetById(req, res) {
        const id = req.params.id

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const pet = await Pet.findOne({ _id:  id })

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        res.status(200).json({
            pet: pet,
        })
    }

    static async removePetById(req, res) {
        const id = req.params.id

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const pet = await Pet.findOne({ _id:  id })

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        // verifica se o pet pertence ao usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Pet não pertencente ao usuário, ação negada!' })
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({ message: 'Pet removido com sucesso!' })
    }

    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color, available } = req.body

        const images = req.files

        const updatedData = {}

        const pet = await Pet.findOne({ _id:  id })

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        // verifica se o  pet pertence ao usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Pet não pertencente ao usuário, ação negada!' })
            return
        }

        if(!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        } else {
            updatedData.name = name
        }

        if(!age) {
            res.status(422).json({ message: 'O campo idade é obrigatório!' })
            return
        } else {
            updatedData.age = age
        }

        if(!weight) {
            res.status(422).json({ message: 'O campo peso é obrigatório!' })
            return
        } else {
            updatedData.weight = weight
        }
        
        if(!color) {
            res.status(422).json({ message: 'O campo cor é obrigatório!' })
            return
        } else {
            updatedData.color = color
        }

        if(images.length === 0) {
            res.status(422).json({ message: 'O campo imagem é obrigatório!' })
            return
        } else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({ message: 'Pet ataualizado com sucesso!' })
    }

    static async schedule(req, res) {
        const id = req.params.id

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const pet = await Pet.findOne({ _id:  id })

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        // Checando o pet é seu
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Não é possível marcar uma visita com o seu próprio pet!' })
            return
        }

        // Checando se o usuário já fez uma visita
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já agendou uma visita para este pet!' })
                return
            }
        }

        // Adicionar usuário como adotante do pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
        })
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id

         // Verifica se o id é válido
         if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        const pet = await Pet.findOne({ _id:  id })

        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' })
            return
        }

        // verifica se o pet pertence ao usuário
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Pet não pertencente ao usuário, ação negada!' })
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: 'O ciclo de adoção foi finalizado com sucesso!' })
    }
}