const { populate } = require('dotenv');
const users = require('../../models/User')
var cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const Users = mongoose.model('users');
const yup = require('yup')
console.log(users)
const registration = async (req, res) => {

    let { name, email, password, confirm_password, ...rest } = req.body
    const nemail = email
    try {
        const nUser =await users.findOne({email:nemail})
        // console.log(nUser)
        if (nUser){
            return res.status(400).json({ msg: "user id already exists" })
        }
        
    } catch (error) {
        return res.status(200).json({ error: error })
    }
    const role = mongoose.Types.ObjectId("63bbb301b65998664747fd66")
    try {
        if (email) {
            if (password) {
                if (password == confirm_password) {
                    
                    password = cryptojs.SHA256(password).toString()
                    const user = new users({email,password,name,role,...rest})
                    
                    user.save((error,data)=>{
                        if(error){
                            console.log('error in registration',error)
                            return res.status(400).json(error)
                        } 
                        
                        return res.status(200).json({ msg: "user added successfully" })
                        
                    })
                }else{
                    return res.status(400).json({ msg: 'password and confirm password must match' })
                }
            } else {
                return res.status(400).json({ msg: 'password is required' })
            }
        }else{
            return res.status(400).json({msg:'email is required'})
        }

    } catch (error) {
        return res.status(400).json(error.message)
    }
}


const login= async(req,res)=>{
    
     
    console.log(req.body)
    // return res.status(200).json({msg:"loggin"})
    const {email,name,picture} = req.body
    const user =await Users.findOne({email:email})
    if (user){
        const token = jwt.sign({_id:email}, process.env.SECRET_KEY, {expiresIn:'1d'})
                // console.log(token)

                res.setHeader("Access-Control-Expose-Headers", '*, authorization')
                res.setHeader('Authorization', 'Bearer ' + token)
        if (user.role!=null){

            console.log("done")
            return res.status(200).json({msg:"role defined"})

        }
        else{

            return res.status(200).json({msg:"role not defined"})

        }
    }
    else{

        const newUser = new Users({
            Name:name,
            email:email,
            image:picture
        })

        try {
            await newUser.save()
            const token = jwt.sign({_id:email}, process.env.SECRET_KEY, {expiresIn:'1d'})
                // console.log(token)

                res.setHeader("Access-Control-Expose-Headers", '*, authorization')
                res.setHeader('Authorization', 'Bearer ' + token)

        return res.status(200).json({msg:"user not defined"})
        } catch (error) {
            console.log(error)
            return res.status(200).json({msg:error})
        }
        
    }

    // try {
    //     const user = await users.findOne({email:email})
    //     if(user){
    //         const encrypted = cryptojs.SHA256(password).toString()
    //         // console.log("encrypted pass",encrypted,user.password)
    //         // const encrypted = password
    //         if(encrypted===user.password){
                
    //             const token = jwt.sign({_id:user._id}, process.env.SECRET_KEY, {expiresIn:'1d'})
    //             // console.log(token)

    //             res.setHeader("Access-Control-Expose-Headers", '*, authorization')
    //             res.setHeader('Authorization', 'Bearer ' + token)
    //             return res.status(200).json({ msg: "Logged in successfully",user_info:user })
    //         }else{
    //             return res.status(400).json({msg:'password not matched'})
    //         }
    //     }else{
    //         return res.status(400).json({msg:'user not found'})
    //     }
    // } catch (error) {
    //     return res.status(400).json(error)
    // }
}

const setRole =async (req,res)=>{
//    console.log(req)
const user = req.user

console.log("3",user)
try {
    const resp = await Users.updateOne({email:user.email},{ $set: { role: req.body.role } })
   res.status(200).json({msg:"role set succesfully"})
} catch (error) {
    res.status(400).json({msg:"role set failed"})
}

}
const checkRole = async (req,res) =>{
    const user = req.user
    try {
        const resp = await Users.findOne({email:user.email}).populate('role')
        console.log("checkrole response is ",resp.role)
        if (resp.role!==null){
            res.status(200).json({msg:true})
        }
        else{
            res.status(200).json({msg:null})
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

const validateInput = yup.object().shape({
    name:yup.string(),
    email:yup.string().email('please enter valid email'),
    password:yup.string('please provide password').min(8)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
    phone:yup.number('please enter a valid number')

})



module.exports = {registration, login, validateInput,setRole,checkRole}