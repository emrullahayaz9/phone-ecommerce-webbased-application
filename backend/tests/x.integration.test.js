const express = require("express");
const indexRouter = require("./index");
const { describe } = require("node:test");
const request =  require("supertest");
const path = require("path");
const { Pool, Client } = require('pg');



const app = express();
app.use("/", indexRouter);
describe("POST /addproduct integration function test", () => {
  it("function test", async () => {
    const response = await request(app).post("/addproduct").send({
        id: "21",
        name: "samsung s22",
        price: "15000",
        description: "good phone samsung s22",
      });

    const { body } = response;
    console.log(response.body);
    expect(body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(String),
      description: expect.any(String),
      picture:"1.jpeg"
    });

    
  });

  it("delete product  /item/delete/:productid",async ()=>{
    const responseAdd = await request(app).post("/addproduct").send({
      id: "7",
      name: "samsung s22",
      price: "15000",
      description: "good phone samsung s22",
    });
      const responseDelete = await request(app).post("/item/delete/7").send({
          id: "7",
          name: "samsung s22",
          price: "15000",
          description: "good phone samsung s22",
      });

      const {body} = responseDelete;
      console.log(body);
      expect(body).toEqual({"status": "DELETED SUCCESSFULLY"});
  })


  it("validation product  /addproduct",async ()=>{
    const responseAdd = await request(app).post("/addproduct").send({
      id: "7",
      name: "",
      price: "15000",
      description: "good phone samsung s22",
    });
    const {body} = responseAdd;
    expect(body).toEqual({
      error:"missing data"
    })
  })

});