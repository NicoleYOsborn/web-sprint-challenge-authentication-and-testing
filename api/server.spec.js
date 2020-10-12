const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');
const testUser = {username: 'ImaTest', password: 'passme'}

describe('server.js', ()=>{
    describe('GET request for jokes', ()=> {
        test('that it returns a status code 400 if not logged in', async ()=>{
            const res = await request(server).get('/api/jokes');
            expect(res.status).toBe(400);
        })
        test("that it returns json", async ()=>{
            const res = await request(server).get('/api/jokes');
            expect(res.type).toBe('application/json');
        });
    });
    describe('registering a new user', ()=>{
        test('that it returns status 201 when a new user is added', async ()=>{
            await db('users').truncate();
            const res = await request(server)
                .post('/api/auth/register')
                .send(testUser);
                expect(res.status).toBe(201);
        });
        test('that it returns a status of 500 with invalid user data', async()=>{
            const res = await request(server)
                .post('/api/auth/register')
                .send({user: "not", pass: "valid"});
                expect(res.status).toBe(500);
        });
    });
    describe('logging in user', ()=>{
        test('that it returns a status of 200 with test user login', async ()=>{
            const res = await request(server)
                .post('/api/auth/login')
                .send(testUser);
                expect(res.status).toBe(200);
        })
        test('that it returns status of 401 when given invalid user data', async ()=>{
            const res = await request(server)
                .post('/api/auth/login')
                .send({username: "ImaFake", password: 'lies'});
                expect(res.status).toBe(401);
        });
    });
});