const {Client }=require('pg')

const client=new Client( {
   user:process.env.USER,
   host:process.env.HOST,
   password:process.env.PASSWORD,
   database:process.env.DB,
   port:process.env.DBPORT


})

client.connect()
    .then(() => {
        console.log("Connected!");
        
    })
    .then(() => {
        console.log("Connection closed.");
    })
    .catch(err => {
        console.error("Error connecting to database:", err);
    });
module.exports=client