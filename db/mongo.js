const mongoose = require('mongoose') 

async function cnt(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ecmr');
        console.log('Database connected!');
    } catch (error) {
        console.error(error.message);
        process.exit(1); 
    }
}

module.exports = cnt;
