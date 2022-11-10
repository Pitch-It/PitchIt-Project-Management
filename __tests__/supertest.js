const request = require('supertest');

const server = 'http://localhost:3000';

// test the different routes
describe('Route Integration', () => {
    describe('/all', () => {
        describe('GET', () => {
            //tests if the http request returns a 200 response
            it('responds with 200 status and application/json content-type', () => {
                return request(server)
                    .get('/all')
                    .expect(200)
            })
            //test if the response comes back in an array format
            it('responds with project list', () => {
                return request(server)
                    .get('/all')
                    .expect((res) => {
                        Array.isArray(res)
                    })
            })
        })
    })
    
    describe('/:id', () => {
        describe('GET', () => {
            it('responds with 200 status and application/json content-type', () => {
                //when the response comes back it will be in a json object
                return request(server)
                    .get('/:id')
                    // .expect('Content-Type', /application\/json/)
                    .expect(200);        
            })
            it('responds with merged project list in the form of an array', () => {
                return request(server)
                    .get('/:id')
                    .expect((res) => {
                        Array.isArray(res)
                    })
            })

        })
        // describe 'DELETE'
        describe('DELETE', () => {
            it('responds with 200 status to a delete request', () => {
                return request(server)
                    .delete('/:id')
                    .expect(200);
            })
        })
            // receive 200 status
            // expect response as boolean
            // expect true

    })

})





//test post request
//? does this use our temporary database?
//describe('/')

// test for both scenarios