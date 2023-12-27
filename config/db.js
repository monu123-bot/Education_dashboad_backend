const mongoose = require('mongoose')

const connectDb = async ()=>{

    try
    {
        const connection  = await mongoose.connect((process.env.MONGOURI),
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    console.log('mongo db connected')

    }

    catch (error) 

    {
        console.log(error)
        process.exit(1)
    }
    
}

module.exports = connectDb