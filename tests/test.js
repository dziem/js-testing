const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiNock = require('chai-nock');
const app = require('../index');
const app1 = require('../index');
const sinon = require("sinon");
const express = require('express');
const calculator = require('../calculator')
const nock = require('nock')

chai.use(chaiHttp);
chai.use(chaiNock);
const should = chai.should();
const expect = chai.expect

const slug = 'lalala';

describe("Using Sinon", () => {
    describe("Stub", () => {
        it("Contoh Penggunaan Stub", (done) => {
            const stub = sinon.stub(calculator, 'tambah').callsFake( () => {
                return 'Hellow World'
            })
            expect(calculator.tambah(2,2)).to.equal('Hellow World')
            done()
            stub.restore()
        })
    })
    describe("Mock", () => {
        it ("Contoh Penggunaan Mock", async () => {
            nock('http://127.0.0.1:3001')
                .get('/api/test-slug/asd')
                .reply(400, { message: 'Hello asdasd' })

            const result = await chai.request('http://127.0.0.1:3001').get('/api/test-slug/asd')
            expect(result.status).to.equal(400);
            expect(result.body).to.deep.equal({ message : 'Hello asdasd'});
            nock.cleanAll()
        })
    })
})



// UNIT TESTING NOT USING (STUB, MOCK)
describe("/", () => {
    describe("Get /", () => {
        it("should be hellow world", (done) => {
            chai.request(app)
                .get('/')
                .end((err,res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Hello World');
                    done()
                })
        })
    })
})

describe("/api", () => {
    describe("Get /test-slug/", () => {
        it("should be return eql slug", (done) => {
            chai.request(app)
                .get(`/api/test-slug/${slug}`)
                .end((err,res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data').eql(slug);
                    done()
                })
        })
    })

    describe("Get /test-if/", () => {
        it("should be return 1", (done) => {
            let param = '1'
            chai.request(app)
                .get(`/api/test-if/${param}`)
                .end((err,res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data').eql('1');
                    done()
                })
        })
        it("should be return 2", (done) => {
            let param = '2'
            chai.request(app)
                .get(`/api/test-if/${param}`)
                .end((err,res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data').eql('2');
                    done()
                })
        })
        it("should be return 400 when not registered in if statement", (done) => {
            let param = '123123'
            chai.request(app)
                .get(`/api/test-if/${param}`)
                .end((err,res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('errors');
                    done()
                })
        })
    })

    describe("Post /test-if/", () => {
        it('it should kalkulator pertambahan 2 + 2 = 4', (done) => {
            let book = {
                a: 2,
                b: 2
            }
            let slug = 'tambah'
            chai.request(app)
                .post(`/api/test-if/${slug}`)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').eql(4);
                    done();
                });
        });
        it('it should kalkulator pengurangan 2 - 2 = 0', (done) => {
            let book = {
                a: 2,
                b: 2
            }
            let slug = 'kurang'
            chai.request(app)
                .post(`/api/test-if/${slug}`)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').eql(0);
                    done();
                });
        });
        it('it should kalkulator pembagian 2 / 2 = 1', (done) => {
            let book = {
                a: 2,
                b: 2
            }
            let slug = 'bagi'
            chai.request(app)
                .post(`/api/test-if/${slug}`)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').eql(1);
                    done();
                });
        });
        it('it should kalkulator pengalian 2 x 2 = 4', (done) => {
            let book = {
                a: 2,
                b: 2
            }
            let slug = 'kali'
            chai.request(app)
                .post(`/api/test-if/${slug}`)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').eql(4);
                    done();
                });
        });
        it('it should handle error jika json nya selain integer', (done) => {
            let book = {
                a: 'asdasd',
                b: 2
            }
            let slug = 'tambah'
            chai.request(app)
                .post(`/api/test-if/${slug}`)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('it should handle error jika slug function gk ada (selain tambah, kurang, bagi, kali)', (done) => {
            let book = {
                a: 2,
                b: 2
            }
            let slug = 'wekeke'
            chai.request(app)
                .post(`/api/test-if/${slug}`)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
    })
})
