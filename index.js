const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iz3dvmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const touristSpotCollection = client.db('tourist').collection('spots');




        app.get('/tourists', async (req, res) => {

            const cursor = touristSpotCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        });

        app.get('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await touristSpotCollection.findOne(query);
            res.send(result);
        })

        app.get('/tourists/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                UserEmail: email
            }
            const result = await touristSpotCollection.find(query).toArray();
            console.log(result);
            res.send(result);

        })


        app.post('/tourists', async (req, res) => {
            try {
                const newSpot = req.body;
                console.log(newSpot);
                const result = await touristSpotCollection.insertOne(newSpot);
                res.json(result); // Send the result as JSON
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('This is the tourism management server');
})

app.listen(port, () => {
    console.log(`The server is running on ${port}`);
})