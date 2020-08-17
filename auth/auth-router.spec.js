const request = require('supertest');
const router = require('./auth-router');
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
        const res = await request(router).post('/register')
        .send({ username: "zelda", password: "captain underpants"})
        expect(res.statusCode).toBe(201)
        expect(res.body.id).toBeDefined()
    })
})
