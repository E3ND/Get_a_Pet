const mongoose = require('mongoose');

// Conection
async function main() {
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('Conectado ao mongoose!')
}

main().catch((error) => console.log(error))

module.exports = mongoose