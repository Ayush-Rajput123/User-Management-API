import express from 'express';
import User from '../model/user.model.js';
const router = express.Router();
import { createToken, verifyToken } from '../auth/jwt.js';
import xss from 'xss';

//signup page
router.post("/signup", async (req, res) => {
    const userData = req.body;

    userData = xss(userData)

    const createdUser = await User.create(userData) 

    const user = new User(userData);
     await user.save(); 
    res.status(201).json({
        createdUser
    })
})


router.post('/signup_multi', async (req, res) => {
    const usersArray = req.body;

    const users = await User.create(usersArray);

    if (!users) {
        res.status(400).json({
            message: "Users couldnt be created"
        })
    }

    res.status(201).json({
        message: "All users created successfully",
        users
    })
})

router.get('/all_users', verifyToken, async (req, res) => {
    try {

        const users = await User.find();
        
        res.status(200).json({
            users
        })


    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})


router.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({
            _id: id
        })

        if (!user) {
            res.status(500).send("No user found")
        }

        res.status(200).json({
            user
        })
    }
    catch (err) {
        res.send(err.message)
    }
})

//find people below the age of 40

router.get("/users/age/:age", async (req, res) => {
    try {
        const age = req.params.age;

        const users = await User.find(
            {
                age: {
                    $lt: age
                }
            }
        )
        res.status(200).json(
            {
                users
            }
        )

    }
    catch (err) {
        res.json({ message: err.message })
    }
})


// fetch users with age more than 25 AND with role user

router.get("/AND", async (req, res) => {
    try {
        const users = await User.find(
            {
                $and: [
                    {
                        age: {
                            $gt: 20
                        }
                    },
                    {
                        role: "user"
                    }
                ]
            }
        )

        if (users.length === 0) {
            res.send("users not found")
        }

        res.status(200).json({
            users
        })
    }
    catch (err) {
        res.send(err.message)
    }
})

//login route
router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            res.status(404).send("User not found")
        }

        console.log(user)

        if (!await user.comparePassword(password)) {
            res.status(400).send({
                message: "Password incorrect"
            })
        }


        const token = createToken(user)
        console.log(token)

        res.status(200).json({
            message: "User logged in successfully",
            user,
            token

        })


    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

//find the users whos address exists in the db 
router.get('/addresscheck', async (req, res) => {
    const user = await User.find({
        address: {
            $exists: true 
        }
    })

    if (user.length === 0) {
        res.send("No users with addresses")
    }

    res.send({ user })
})


router.get("/typecheck", async (req, res) => {
    const users = await User.find({
        age: {
            $type: "number"
        }
    })

    if (users.length === 0) {
        res.send("No users with age number")
    }

    res.send({ users })
})
router.get("/validRoles", async (req, res) => {
    const users = await User.find({
        role: {
            $in: ["superadmin"]
        }
    })

    res.send({ users })
})

//Update  
router.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findOneAndUpdate(
            {
                _id: id 
            },
            {
                $set: {
                    age: req.body.age
                }
            },
            {
                new: true, 
                runValidators: true 
            }

        )

        res.send(user)

    } catch (err) {
        res.send(err.message)
    }
})

router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.deleteOne({
        _id: id
    })

    res.json({
        message: "User deleted successfully",
        user
    })
})
export default router;