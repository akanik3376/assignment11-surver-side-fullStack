const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middle ware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.vfr78tp.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const jobCollection = client.db('jobDB').collection('jobs')
        const applyCollection = client.db('jobDB').collection('applyJob')

        // post data from clint side to server side
        app.post('/api/v1/jobs', async (req, res) => {
            const newJob = req.body;
            // console.log(newJob)
            const result = await jobCollection.insertOne(newJob);
            console.log(result)
            res.send(result)
        })

        // get data from clint side
        app.get('/api/v1/jobs', async (req, res) => {
            const cursor = jobCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // single data for details page
        app.get('/api/v1/jobs/:id', async (req, res) => {
            const jobId = req.params.id;
            // console.log(jobId)
            const query = { _id: new ObjectId(jobId) }
            const cursor = jobCollection.findOne(query);
            const result = await cursor;

            if (result) {
                console.log(result)
                res.send(result);
            } else {
                res.status(404).send('Job not found');
            }
        });


        // post apply jobs information  data from clint side to server side
        app.post('/api/v1/jobs/apply/user/request', async (req, res) => {

            const user = req.body

            try {
                const result = await applyCollection.insertOne(user);
                console.log(user)
                res.send(result);
            } catch (error) {
                console.error(error);

            }
        });


        // get apply jobs information  data from clint side to server side
        app.get('/api/v1/jobs/apply/user/request', async (req, res) => {
            let query = {}
            // console.log(query)
            if (req.query?.email) {
                query = { email: req.query?.email }

            }
            // console.log(query)
            const result = await applyCollection.find(query).toArray();

            res.send(result)

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




// console.log(process.env.DB_NAME)

// 
app.get('/', (req, res) => {
    res.send('app is running')
})
app.listen(port, () => {
    console.log(`app is running port on : ${port}`)
})