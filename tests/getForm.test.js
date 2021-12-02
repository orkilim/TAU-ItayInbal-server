const testJson=require('./test.json')
const supertest=require('supertest')
const {app}=require('../server')
const request = require('supertest');
const mongoose=require('mongoose');
const {url,host}=require('../consts');
const { response } = require('express');



test("getting a json from the database", async ()=>{
    
    await request(app)
      .get('/route/get-form?title=my test 123')
      .set('Accept', 'application/json')
      .then((response)=>{
        expect(response.body).toHaveProperty("schema")
      })
      
      
      
      
})
