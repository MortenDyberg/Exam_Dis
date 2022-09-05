const Pool = require('pg').Pool;
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'banking',
    password:'postgres',
    port:5432
})

module.exports = pool;

pool.query(`
            CREATE TABLE if not exists Client
            (_id serial primary key,
            firstname varchar(50) not null,
            lastname varchar(50) not null ,
            "streetAddress" varchar(50) not null,
            city varchar (50) not null)
            ;

            create table if not exists  
            Account(
            _id serial primary key,
            client_id int references client(_id) on delete cascade,
            balance int,
            alias varchar (50))
            ;
            `).then(()=>{
            }).catch((err)=>{
                console.log(err);
            })
