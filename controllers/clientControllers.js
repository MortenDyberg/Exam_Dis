const pool = require('../db.js');
//Get all clients in the client table
async function getClients (req, res) {
    try {
        let clients = await pool.query(
            `select * from Client order by _id`);
        res.json(clients.rows);
    } catch (err) {
        res.send("An error occurred");
    }
}
//Adds a new row to the client table
async function postClient (req, res) {
    try {
        const query = await pool.query(
            `insert into client (firstname, lastname, "streetAddress", city)
            VALUES ($1, $2, $3, $4) 
            returning _id, firstname, lastname, city, "streetAddress";`, 
            [req.body.firstname, req.body.lastname,
            req.body.streetAddress, req.body.city]);
        res.json(query.rows[0]);
    } catch (err) {
        res.json(err);
    }
}
//Returns a specific client using id parameter
async function getClient (req, res) {
    try {
        let client = await pool.query(
            `select * from Client where _id = $1`,
            [req.params.id]);
        res.json(client.rows[0]);
    } catch (err) {
        res.send(err);
    }
}
//Updates a client. Using coalesce to avoid null values if parameters are undefined
async function putClient (req, res) {
    try {
        const query = await pool.query(`
            update client set 
            firstname = COALESCE($1, firstname), 
            lastname = COALESCE($2, lastname), 
            "streetAddress"= COALESCE($3, "streetAddress"),
            city = COALESCE($4, city)
            where _id = $5 returning _id, firstname, lastname, "streetAddress", city;`, 
            [req.body.firstname, req.body.lastname, 
            req.body.streetAddress, req.body.city, req.params.id]);
        if (query.rowCount === 1){
            res.json(query.rows[0]);
        } else {
                throw "Error occurred";
        }
    } catch (err) {
        res.json(err);
    }
}
//Deletes a client from the client table
async function deleteClient (req, res) {
    try {
        const query = await pool.query(`
            delete from client where _id = $1 
            returning _id, firstname, lastname, "streetAddress", city;`, 
            [req.params.id]);
        if (query.rowCount === 1){
            res.json(query.rows[0]);
        } else {
            throw 'Not found';
        }
    } catch (err) {
        res.json(err);
    }
}

module.exports = {
    getClients, postClient, getClient, putClient, deleteClient
}