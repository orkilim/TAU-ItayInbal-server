const testJson=require('./test.json')
const supertest=require('supertest')
const {app}=require('../server')
const request = require('supertest');
const mongoose=require('mongoose');
const { schema } = require('../models/configuration');



test("getting a json from the database", async ()=>{
    const obj={
        title:"exp 1",
    }
    const response= await request(app)
      .post('/route/get-form')
      .send(obj)
      .set('Accept', 'application/json')
    expect(response).toHaveProperty(schema)
      
})
