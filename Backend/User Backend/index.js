const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohit10231:rohitkaranpujari@cluster0.kjynvxt.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)
const port = 6500

// getting all users
app.get('', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        if (req.query.email === '') {
            let allUsers = await db.collection('All_Users').aggregate([]).toArray()
            if (allUsers.length) {
                res.status(200).send(allUsers)
            }
            else {
                res.send({ message: "No Users Found" })
            }
        }
        else {
            let user = await db.collection('All_Users').aggregate([{ $match: { email: req.query.email } }]).toArray()
            res.status(200).send(user)
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// creating new user
app.post('/signup', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let user = await db.collection('All_Users').aggregate([{ $match: { email: req.body.email } }]).toArray()
        if (user.length === 0) {
            await db.collection('All_Users').insertOne(req.body)
            res.status(201).send({ message: 'signup successful', data: req.body })
        }
        else {
            res.send({ message: 'email id/security code already exist' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// user password change
app.put('/changePassword/:email/:securityCode', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let user = await db.collection('All_Users').aggregate([{ $match: { email: req.params.email, securityCode: req.params.securityCode } }]).toArray()
        if (user.length !== 0) {
            await db.collection('All_Users').updateOne({ email: req.params.email, securityCode: req.params.securityCode }, { $set: req.body })
            res.status(200).send({ message: 'Password updated successfully' })
        }
        else {
            res.send({ message: 'Invalid credentials' })
        }
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// update user info
app.put('/updateUser/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        await db.collection('All_Users').updateOne({ email: req.params.email }, { $set: req.body })
        res.status(200).send({ message: 'Password updated successfully' })
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// user login
app.get('/login', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = client.db('Pujari_JCB_Spares')
        if (req.query.password === undefined) {
            console.log('google login');
            let user = await db.collection('All_Users').aggregate([{ $match: { email: req.query.email } }]).toArray()
            if (user.length !== 0) {
                res.status(200).send({ message: 'Login Successful', data: user })
            }
            else {
                res.send({ message: 'Invalid credentials' })
            }
        }
        else {
            console.log('not google login');
            let user = await db.collection('All_Users').aggregate([{ $match: { email: req.query.email, password: req.query.password } }]).toArray()
            if (user.length !== 0) {
                res.status(200).send({ message: 'Login Successful', data: user })
            }
            else {
                res.send({ message: 'Invalid credentials' })
            }
        }

    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// 

// delete user
app.delete('/deleteUser/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        await db.collection('All_Users').deleteOne({ email: req.params.email })
        await db.collection('Orders').deleteMany({ email: req.params.email })
        res.status(200).send({ message: 'user deleted' })
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

app.listen(port, () => { console.log(`App listening on ${port}`) })
