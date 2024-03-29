const express = require('express')
require('dotenv').config()
const cors = require('cors')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const { PrivateKey, PublicKey } = require('./src/keyexchange')
const Prometheus = require('prom-client')
const router = require('./routes/voter.routes')
const ContractRouter = require('./routes/contract.routes');
const { HttpStatusCode } = require('axios')

// server configurations
const PORT = process.env.PORT || 5000
const app = express()

// middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({
        "status": HttpStatusCode.Ok,
        "message":'Server running perfectly'
    })
})

app.get('/secret', isAuthorized, (req, res) => {
    res.json({ 
        "status": HttpStatusCode.Ok,
        "message" : "Secret keys",
        "private_key": PrivateKey,
        "public_key": PublicKey 
    })
})

app.get('/jwt', (req, res) => {
    let privateKey = fs.readFileSync('./private.pem', 'utf8');
    let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256'});
    res.status(200).send(token);
})

function isAuthorized(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = fs.readFileSync('./private.pem', 'utf8');
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized
        res.status(500).json({ error: "Not Authorized" });
    }
}


// Prometheus Metrics Route
// const collectDefaultMetrics  = Prometheus.collectDefaultMetrics;
// collectDefaultMetrics({ timeout: 5000 });
const register = Prometheus.Registry;

// Prometheus.collectDefaultMetrics({ register })
app.use('/api', router)

// contractRoute
app.use('/v1/contract', ContractRouter)

// api: v2
app.use('/v2', require('./routes/version/contract.v2.routes'))

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT} 🚀`)
})