const pool = require('../db.js');

//Get all accounts in account table
async function getAccounts (req, res) {
    try {
        let accounts = await pool.query(
            `select * from Account order by _id;`);
        accounts = accounts.rows;
        res.json(accounts);
    } catch (err) {
        res.send("An error occurred");
    }
}
//Add a new row to the account table
async function postAccount (req, res) {
    try {
        const query = await pool.query(
            `insert into account (client_id, balance, alias) 
            VALUES ($1, $2, $3) 
            returning _id, client_id, balance, alias;`, 
            [req.body.client_id, req.body.balance, req.body.alias]);
            res.json(query.rows[0]);
    } catch (err) {
        res.json(err);
    }
}
//Get specific account by id in parameter
async function getAccount (req, res) {
    try {
        let accounts = await pool.query(
            `select * from Account where _id = $1 
            order by _id;`, 
            [req.params.id]);
        res.json(accounts.rows[0]);
    } catch (err) {
        res.send(err);
    }
}


//Updating information. Using coalesce to avoid null values if parameters are undefined
async function putBalance (req, res) {
    try {
        const query = await pool.query(`
            update account set 
            balance = COALESCE($1, balance),
            alias= COALESCE($2, alias)
            where _id = $3 
            returning *`, 
            [req.body.balance, req.body.alias, req.params.id]);
        if (query.rowCount === 1){
            res.json(query.rows[0]);
        } else {
            throw 'Error';
        }
    } catch (err) {
        res.json(err);
    }
}
//Deletes a row in the account table. Takes a specific id
async function deleteAccount (req, res) {
    try {
        const query = await pool.query(`
            delete from account where _id = $1
            returning _id;`, 
            [req.params.id]);
        if (query.rowCount === 1){
            res.json(query.rows[0]);
        } else {
            throw 'An error occurred';
        }
    } catch (err) {
        res.json(err);
    }
}
//Gets the balance of a specific account
async function getBalance (req, res) {
    try {
        let balance = await pool.query(
            `select balance from Account 
            where _id = $1;`, 
            [req.params.id]);
        res.json(balance.rows[0]);
    } catch (err) {
        res.send(err);
    }
}
//Transfers amount from one to account to another. Using SQL-transaction for security 
async function putTransfer (req, res) {
    try {
        let {fromAccount, toAccount, amount} = req.body;
        await pool.query('begin;');
        const query1 = await pool.query(`
            update account set balance = balance - $1 where _id = $2 and balance >= $3 returning balance;`, 
            [amount, fromAccount, amount]);
        const query2 = await pool.query(`
            update account set balance = balance + $1 where _id = $2 returning balance;`, [amount, toAccount]);
        if (query1.rowCount === 1 && query2.rowCount === 1){
            await pool.query('commit;');
            res.json(query2.rows[0].balance);
        } else {
            throw 'Error';
        }
    } catch (err) {
        await pool.query('rollback;');
        res.json(err);
    }
}





module.exports = {
    getAccounts, getAccount, getBalance, postAccount, putBalance, deleteAccount, putTransfer
}