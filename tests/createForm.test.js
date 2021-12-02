const testJson=require('./test.json')
const supertest=require('supertest')
const {app}=require('../server')
const request = require('supertest');
const mongoose=require('mongoose')

afterAll(done => {
    // THIS IS HOW YOU CLOSE CONNECTION IN MONGOOSE (mongodb ORM)
    mongoose.connection.close();
    done();
  });

test("successfully creating a form", async ()=>{
    jest.setTimeout(15000)
    
    const obj={
        name:"my test 123",
        schema:testJson
    }
    await request(app)
      .post('/route/create-form')
      .send(obj)
      .set('Accept', 'application/json')
      .expect(200)
      
})

test("trying to create a form without a name or a schema",()=>{
    const obj={
        schema:testJson
    }
    request(app)
      .post('/route/create-form')
      .send(obj)
      .set('Accept', 'application/json')
      .expect(500)
      
})

test("creating a configuatrion without schema", async ()=>{
    const obj={
        name:"my test 123",
    }
    await request(app)
      .post('/route/create-form')
      .send(obj)
      .set('Accept', 'application/json')
      .expect(500)
      
})