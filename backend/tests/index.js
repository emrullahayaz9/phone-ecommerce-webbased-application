const express = require("express");

const router = express.Router();
router.use(express.json());
const path = require("path");
const { Pool, Client } = require('pg');


  require('dotenv').config({
    override:true,
    path:path.join(__dirname,"test.env")
  });
  const pool = new Pool({
    user:process.env.USER,
    host:process.env.HOST,
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:process.env.PORT
  });




// add product
  const addP = (async(object)=>{
    const client = await pool.connect();
    //const test = await test_pool.connect();
    try{
      const {rows} = await client.query("SELECT current_user");
      const currentUser = rows[0]["current_user"];
      const addQuery = `
  INSERT INTO telefonlar (id, name, price, description, picture) VALUES (${object.id}, '${object.name}', '${object.price}', '${object.description}', '1.jpeg');
`;

      client.query(addQuery);
    }catch(err){
      console.log(err);
    }finally{
      client.release();
    }
    })
    // delete product
  const deleteP = (async(object)=>{
    const client = await pool.connect();
   // const test = await test_pool.connect();
    try{
      const {rows} = await client.query("SELECT current_user");
      const currentUser = rows[0]["current_user"];
      const deleteQuery = `DELETE FROM telefonlar WHERE id=${object.id};`;
 
      client.query(deleteQuery);
      //test.query(deleteQuery);
     
    }catch(err){
      console.log(err);
    }finally{
      client.release();
    }
    })
   // get product
const getP = async () => {
    const client = await pool.connect();
    //const test = await test_pool.connect();
    try {
        const { rows } = await client.query("SELECT current_user");
        const currentUser = rows[0]["current_user"];
        const getAll = `SELECT * FROM telefonlar`;

        const result = await client.query(getAll);
       // const test_Result = await test.query(getAll);

        return result.rows;

    } catch (err) {
        console.log(err);
        throw err; // Hata durumunda hatayı fırlat
    } finally {
        client.release();
    }
};

cart = [];
let cart_total = 0;

// db cart
const total= ()=>{
    cart_total=0;
    for(let i = 0; i<cart.length; i++){

        cart_total+=Number(cart[i].product.price);

    }
    return cart_total;
}

router.use("/cart/delete/:productid", function(request, response) {
    temporary_cart = [];
    for(let i = 0; i< cart.length; i++){
        if (request.params.productid!=cart[i].product.id){

            temporary_cart.push({product:cart[i].product});
        }
    }
    cart = temporary_cart;
    totalC= total();
    response.render("users/cart.ejs", {"cart":cart, "total":totalC});
})
router.get("/addproduct", (request, response)=>{
  response.render("users/add.ejs");
})
router.use("/item/delete/:productid",async function(request, response) {
  let items = await getP();
  var product;
// db deletion
  for (let i = 0; i<items.length;i++){
    if (items[i].id==request.params.productid){
      product = items[i];
      break;
    }
  }
  await deleteP(product);


  response.json({"status": "DELETED SUCCESSFULLY"});
})

 router.post("/addproduct",async(request, response)=>{
        let name = request.body.name; 
        let price = request.body.price; 
        let description = request.body.description;
        let product = {id:request.body.id,name:name, price:price, description:description, picture:"1.jpeg"};
        if(name=="" || price==0|| request.body.id==""){
          response.json({error:"missing data"});
          return;
        } 
        await addP(product); 
        response.json(product);
        response.render("users/success.ejs");
})

router.use("/buy/:productid", function(request, response) {
    response.render("users/checkout.ejs");
})
router.use("/buy", function(request, response) {
    response.render("users/checkout.ejs");
})

router.use("/cart/:productid",async function(request, response) {
  products = await getP();
    var product;
    for(let i = 0; i<products.length; i++){
      if (products[i].id==request.params.productid){
        product={product:products[i]};
        break;
      }
    }
    cart.push(product);
    totalC= total();
    response.render("users/cart.ejs", {"cart":cart, "total":totalC});
})



router.use("/cart", function(request, response) {
    totalC= total();
    response.render("users/cart.ejs", {"cart":cart, "total":totalC});
})


router.use("/productdetail/:productid", async function(request, response) {
    products = await getP();
    var product;
    for(let i = 0; i<products.length; i++){
      if (products[i].id==request.params.productid){
        product={product:products[i]};
        break;
      }
    }
    response.render("users/product-detail.ejs", product);
})


router.get("/", async function (request, response) {
    
  
  try {
      
        const products = await getP();
        response.json(products);
    } catch (err) {
        console.error(err);
        response.status(500).send("Internal Server Error");
    }
});



module.exports = router; 