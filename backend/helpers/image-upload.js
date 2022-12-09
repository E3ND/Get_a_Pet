const multer = require('multer')
const path = require('path')

// Destino das imagens
const imageStore = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = ''

        if(req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('pets')) {
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStore,
    fileFilter(req, file, cb) {
        // Não deixa fazer o upload de outra extensão de image, so png e jpg
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Por favor, envie somente jpg ou png'))
        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload }