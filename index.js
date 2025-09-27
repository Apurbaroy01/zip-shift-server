const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 5000

// zip_shift12

app.use(cors())
app.use(express.json())

console.log(process.env.USER_PASs)



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASs}@cluster0.4gy1j38.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        console.log("You successfully connected to MongoDB!✅");


        const parcelCollection = client.db("zip_shift").collection("parcels");

        app.post('/parcels', async (req, res) => {
            const body = req.body
            const result = await parcelCollection.insertOne(body)
            res.send(result);
        })

        app.get('/parcels', async (req, res) => {
            const userEmail = req.query.email;
            const query = userEmail ? { email: userEmail } : {};
            const options = {
                sort: { creation_Date: - 1 }
            }
            const result = await parcelCollection.find(query, options).toArray()
            res.send(result);
        });

        app.delete('/parcels/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await parcelCollection.deleteOne(query)
            res.send(result);
        })



    }
    catch (error) {
        console.error("Error❌", error.message)
    }
}
run();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
