const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const createuserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // Validations
        if(!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!.' })
            return
        }
        if(!email) {
            res.status(422).json({ message: 'O campo e-mail é obrigatório!.' })
            return
        }
        if(!phone) {
            res.status(422).json({ message: 'O campo telefone é obrigatório!.' })
            return
        }
        if(!password) {
            res.status(422).json({ message: 'O campo senha é obrigatório!.' })
            return
        }

        if(password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não coincidem.' })
            return
        }

        // Verifique se o usuário não existe
        const userExists = await User.findOne({ email: email })

        if(userExists) {
            res.status(422).json({ message: 'E-mail já cadastrado, utilize outro e-mail.' })
            return
        }

        // encrypt password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // Register user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            
            // Create token
            await createuserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        // Validations
        if(!email || !password) {
            res.status(422).json({ message: 'Preencha todos os campos.' })
            return
        }

         // Verifique se o usuário não existe
         const user = await User.findOne({ email: email })

         if(!user) {
             res.status(422).json({ message: 'Não existe usuário cadastrado com este e-mail.' })
             return
         }

         // Verifique se a senha corresponde à senha do db
         const checkPassword = await bcrypt.compare(password, user.password)

         if(!checkPassword) {
            res.status(422).json({ message: 'Senha incorreta!'})
            return
         }

         // Create token
         await createuserToken(user, req, res)
    }

    static async checkUser(req, res) {
        //  Check token
        let currentUser

        if(req.headers.authorization){
            const token = getToken(req)

            // Verifica e valida o token com jwt
            const decoded = jwt.verify(token, 'dadounicobeoqoljsccs')

            currentUser = await User.findById(decoded.id).select('-password')

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        // O id não pode ter mais de 24 caracteres e não menos de 12 bytes
        if (!id.match(/^[0-9a-fA-F]{24}$/)){
            res.status(422).json({ message: 'Id inválido ou alterado!' })

            return
        }

        const user = await User.findById(id).select('-password')

        if(!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })

            return
        }
        

        res.status(200).json({ user })
    }

    static async editUser(req, res){
        const id = req.params.id

        const token = getToken(req)
        let user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword} = req.body
        
        let image = ''

        if(req.file) {
            image = req.file.filename
        }

        // ValidationsgetUserByToken
        if(!name || !email || !phone) {
            res.status(422).json({ message: 'Preencha todos os campos.' })
            return
        }

        // O id não pode ter mais de 24 caracteres e não menos de 12 bytes
        if (!id.match(/^[0-9a-fA-F]{24}$/)){
            res.status(422).json({ message: 'Id inválido ou alterado!' })

            return
        }

        // Usuário não encontrado
        if(!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })

            return
        }

        // Verifica se o email já  está vinculado a outra cadastro
        const userExists = await User.findOne({ email: email})

        if(user.email !== email && userExists) {
            res.status(422).json({ message: 'Utilize outro e-mail!' })

            return
        }
                                             
        // Validações da senha
        if(password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não coincidem.' })
            return
        } else if(password == confirmpassword && password != null) {
            // Create password
            const salt = await bcrypt.genSalt(12)
            user.password = await bcrypt.hash(password, salt)
        }

        user = {
            _id: user._id,
            name: name,
            email: email,
            password: user.password,
            phone: phone,
            image: image
        }
        
        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({ message: 'Usuário atualizado com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })

            return
        }
    }
}