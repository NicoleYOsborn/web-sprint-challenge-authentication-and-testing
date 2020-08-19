const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

describe('GET /', ()=>{
    it('has process.env.DB_ENV as "testing"', ()=>{
        expect(process.env.DB_ENV).toBe('testing');
    })
})

beforeAll(async () => {
    // this function executes and clears out the table before each test
    await db('users').truncate();
  });
  

describe('auth server integration test', ()=>{
    it("POST /register creates a user", async ()=>{
        const res = await request(server)
            .post('/api/auth/register')
            .send({username: "zelda", password: "captain underpants"})
        expect(res.statusCode).toBe(201)
        expect(res.body.id).toBeDefined()
    })
    it("POST /register (failing)", async ()=>{
        const res = await request(server)
            .post('/api/auth/register')
            .send({})
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe("Username and password are required")
    })
    it("POST api/login", async ()=>{
        const res = await request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({username: "zelda", password: "captain underpants"})
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe("Welcome zelda")
    })
    
})