const express = require("express");
const path = require("path");
var bodyParser = require('body-parser');
var multer = require('multer');
var forms = multer();
const cors = require("cors");


const { Pool, Client } = require('pg')
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config({
  override:true,
  path:path.join(__dirname,"development.env")
});
const pool = new Pool({
  user:process.env.USER,
  host:process.env.HOST,
  database:process.env.DATABASE,
  password:process.env.PASSWORD,
  port:process.env.PORT
})
require('dotenv').config({
  override:true,
  path:path.join(__dirname,"test.env")
});
const pool_test = new Pool({
  user:process.env.USER,
  host:process.env.HOST,
  database:process.env.DATABASE,
  password:process.env.PASSWORD,
  port:process.env.PORT
});

const callf = (async()=>{
  const client = await pool.connect();
  const test = await pool_test.connect();
  try{
    const { rows } = await client.query("SELECT current_user");
    const { rows: rows_test } = await test.query("SELECT current_user");
    const currentUser = rows[0]["current_user"];
    const currentUser_test = rows_test[0]["current_user"];
    console.log(currentUser);
    console.log(currentUser_test+"  test");
    const createQuery = `CREATE TABLE IF NOT EXISTS public.telefonlar (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      price VARCHAR(100),
      description VARCHAR(100),
      picture VARCHAR(100)
      );
      CREATE TABLE IF NOT EXISTS public.cart (
        id SERIAL PRIMARY KEY,
        telefon_id INTEGER REFERENCES public.telefonlar(id) UNIQUE
      );
    `;
  client.query(createQuery);
  test.query(createQuery);
   
  }catch(err){
    console.log(err);
  }finally{
    client.release();
  }
  })
callf();
app.use(bodyParser.json());
app.use(forms.array()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

const index_route = require("./routes/index"); 
app.set("view engine", "ejs");

app.use("/", index_route);


app.listen(8000, function() {
    console.log("Listening on port 8000");
})  


