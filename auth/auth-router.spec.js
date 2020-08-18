const request = require('supertest');
const router = require('./auth-router');
const jokerouter = require('../jokes/jokes-router')
const db = require('../database/dbConfig');


describe('GET /', ()=>{
    it('has process.env.DB_ENV as "testing"', ()=>{
        expect(process.env.DB_ENV).toBe('testing');
    })
})
beforeEach(async ()=>{
    await db.seed.run()
})

afterAll(async ()=>{
    await db.destroy()
})
describe('auth router integration test', ()=>{
    it("POST /register", async ()=>{
        const res = await request(router)
            .post('/register')
            .set('Content-Type', 'application/json')
            .send({username: "zelda", password: "captain underpants"})
        expect(res.statusCode).toBe(201)
        expect(res.body.id).toBeDefined()
    })
    it("POST /register (failing)", async ()=>{
        const res = await request(router)
            .post('/register')
            .set('Content-Type', 'application/json')
            .send({})
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe("Username and password are required")
    })
    it("POST /login", async ()=>{
        const res = await request(router)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({username: "janedoe", password: "abc12345"})
        expect(res.statusCode).toBe(201)
        expect(res.body.id).toBe(1)
    })
    it("POST /login (failed)", async ()=>{
        const res = await request(router)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({})
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe("A valid username and password are required.")
    })
})
describe('jokes router integration test', ()=>{
    let token;
    beforeAll((done) => {
        request(router)
          .post('/login')
          .send({
            username: "janedoe",
            password: "abc12345",
          })
          .end((err, response) => {
            token = response.body.token; // save the token!
            done();
          });
      });
    
    it("GET / (not authorized)", async ()=>{
        const res = await request(jokerouter)
            .get('/')
            .then(response)=>{
                expect(response.statuscode).toBe(500)
            }
    })
    it("GET / (authorized)", async ()=>{
        const res = await request(jokerouter)
            .get('/')
            .set("Authorization", `Bearer ${token}`)
            .then((response)=>{
                expect(res.statusCode).toBe(200)
                expect(res.body).toBe("application/json")   
            })
    })
})
