const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors({ origin: ["http://localhost:5173/", "https://tourism-management-websi-84dfd.web.app"] }))

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


        const touristSpotCollection = client.db('tourist').collection('spots');

        const countriesCollection = client.db('countriesDB').collection('country');


        app.get('/tourists', async (req, res) => {

            const cursor = touristSpotCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        });

        app.get('/tourists/country/:countryName', async (req, res) => {
            const countryName = req.params.countryName;
            const query = {
                countryName: countryName
            }
            const result = await touristSpotCollection.find(query).toArray();

            res.send(result);
        })

        app.get('/countries', async (req, res) => {
            const cursor = countriesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

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
                res.json(result);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });



        app.delete('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await touristSpotCollection.deleteOne(query);
            res.send(result);
        })


        app.put('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateTouristSpot = req.body;

            const TouristSpot = {
                $set: {
                    image: updateTouristSpot.image,
                    touristsSpotName: updateTouristSpot.touristsSpotName,
                    countryName: updateTouristSpot.countryName,
                    location: updateTouristSpot.location,
                    averageCost: updateTouristSpot.averageCost,
                    seasonality: updateTouristSpot.seasonality,
                    travelTime: updateTouristSpot.travelTime,
                    totalVisitorsPerYear: updateTouristSpot.totalVisitorsPerYear,
                    textarea: updateTouristSpot.textarea,
                    UserName: updateTouristSpot.UserName
                }
            }

            const result = await touristSpotCollection.updateOne(filter, TouristSpot, options);
            res.send(result);
        })


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