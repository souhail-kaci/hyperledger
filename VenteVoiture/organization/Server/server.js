'use strict';

const ORG = {
    Alice : 'org1',
    Bob : 'org2'
}

const fs = require('fs');
const yaml = require('js-yaml');
const {Wallets, Gateway} = require('fabric-network');
const Car = require("../Alice/contract/lib/car");
const express = require('express');
const app = express();
const cors = require("cors");
const http = require('http');
app.use(cors());
app.use(express.json());
const WebSocketServer = require('ws').Server;
const server = http.createServer(app);
const wss = new WebSocketServer({server : server});



wss.broadcast = function broadcast(message) {
    wss.clients.forEach(function each(client) {
        client.send(message);
    });
};
wss.on('connection', function(client, request) {
    client.send('Welcome, client');
});



app.get('/api/cars/:owner', async (req, res) => {

    const wallet = await Wallets.newFileSystemWallet('../'+req.params.owner+'/identity/user/'+req.params.owner+'/wallet');
    const gateway = new Gateway();
    try {

        const userName = req.params.owner;

        let connectionProfile = yaml.safeLoad(fs.readFileSync('../'+req.params.owner+'/gateway/connection-'+ORG[req.params.owner]+'.yaml', 'utf8'));

        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true}
        };
        await gateway.connect(connectionProfile, connectionOptions);
        const network = await gateway.getNetwork('mychannel');
        const contract = await network.getContract('carcontract', 'org.carmarket.car');
        let queryResponse = await contract.evaluateTransaction('queryOwner', req.params.owner);
        let json = JSON.parse(queryResponse.toString());
        json = json.filter(car => {
            if (req.query.client === undefined || car.Record.owner === req.query.client)
                return true;
            else{
                return car.Record.upForSale === 'true';
            }
        });
        res.send(json);
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    }


});


app.post("/api/car/sell", async (req, res) => {

    const wallet = await Wallets.newFileSystemWallet('../'+req.body.owner+'/identity/user/'+req.body.owner+'/wallet');

    const gateway = new Gateway();

    try {
        const userName = req.body.owner;
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../'+req.body.owner+'/gateway/connection-'+ORG[req.body.owner]+'.yaml', 'utf8'));
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true}
        };
        //Connect to the gateway using the specified parameters
        await gateway.connect(connectionProfile, connectionOptions);
        //Getting the network
        const network = await gateway.getNetwork('mychannel');
        //Getting the smart contract
        const contract = await network.getContract('carcontract', 'org.carmarket.car');
        //Submit transaction for car sale

        if (req.body.for === "Add") {
            const sellResponse = await contract.evaluateTransaction('info', req.body.org, req.body.carNumber);
            try {
                let car = Car.fromBuffer(sellResponse);
                res.status(500).send('Something broke!');
            } catch (err) {
                console.log("not Found")
            }

        }

        const sellResponse = await contract.submitTransaction('sale', req.body.owner, req.body.org,req.body.carNumber, req.body.carBrand, req.body.carModel, req.body.price,req.body.upForSale);
        let car = Car.fromBuffer(sellResponse);
        wss.broadcast("update");
        res.send(car);
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    }


});

app.put("/api/car/buy", async (req, res) => {
    const wallet = await Wallets.newFileSystemWallet('../'+req.body.buyer+'/identity/user/'+req.body.buyer+'/wallet');
    const gateway = new Gateway();

    try {
        const userName = req.body.buyer;

        let connectionProfile = yaml.safeLoad(fs.readFileSync('../'+req.body.buyer+'/gateway/connection-'+ORG[req.body.buyer]+'.yaml', 'utf8'));
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true}
        };

       await gateway.connect(connectionProfile, connectionOptions);

        const network = await gateway.getNetwork('mychannel');

        const contract = await network.getContract('carcontract', 'org.carmarket.car');

        const buyResponse = await contract.submitTransaction('buy', req.body.owner,req.body.org,req.body.carNumber, req.body.carBrand, req.body.buyer, req.body.price);
        let car = Car.fromBuffer(buyResponse);
        wss.broadcast("update");
        res.send(car);

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    }
})

const PORT = 3001;

server.listen(PORT, () => {
    console.log("Server is running...");
});
