/*

Create an issuance micro service

- Dockerize the application and push the docker image to dockerhub
- Once pushed both the microservices, use AWS EKS service to create a k8 cluster
and there shall be four nodes , one master node other three worker nodes
- The backend microservice will be running on either of the three worker nodes
- there will be two pods each running docker container of the two microservices,
- and there will a deployment.yaml file and services.yaml , 
- the deployment.yaml file will create replicasets of how much we want for each microservice
- the services.yaml file will connect different worker nodes and subsequently the pods also


--------
TESTS WILL BE LOCAL ONLY, NOT PRODUCTION,
one can run the tests by running the dockerimage to run the microservice first
OR
just via the commands `supertest` OR `vitest`!

The thing which i do not know is how to make the data persistant, as asked in the assignments
Is there a data volume layer which syns the data,

So once i dockerize both the microservices and i create a K8's cluster on AWS EKS
once created!, i create a cluster of four nodes, 1 master and three workers,
all the instructions will be given to the master node,

- So i create two pods for each microservice, issuance and verification, via deployment.yml file
- So for each service there will be two different deployment.yml files

So if a user issues their credentials it gets issued stored in DB, and issued by which worker-id
how will i figure that our, 
Can that be done just via `os.hostname()`

Now once the verification service passes its credentials , how will i cross check it against the DB,

These are the two main issues that i have,



*/
import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import router from './router/routes';
import os from "os";
import { initDatabase, closeDatabase } from "./Database/db";
import cors from "cors"

const WORKER_ID = process.env.HOST_NAME || os.hostname();
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())

// initialize the DB
initDatabase();

app.get("/" , (req:Request,res:Response) => {
    console.log("AA gaye tum! ");
    res.status(200).json({
        "message":"you are connected!"
    })
})

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'healthy', 
      service: 'issuance',
      worker: WORKER_ID,
      timestamp: new Date().toISOString()
    });
  });
app.use(router);

const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, ()=> {
    console.log(`we are listening to port ${PORT}` );
    console.log(`Worker ID: ${WORKER_ID}`);
})

const shutdown = (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(() => {
        try {
            closeDatabase();
        } catch {}
        console.log('HTTP server closed. Bye!');
        process.exit(0);
    });
    // Force exit if not closed in time
    setTimeout(() => {
        console.error('Force exiting after timeout');
        process.exit(1);
    }, 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

console.log("hello world");