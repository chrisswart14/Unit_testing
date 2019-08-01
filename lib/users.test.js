const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');

var mongoose = require('mongoose');

var users = rewire('./users');
var User = require('./models/user');
var mailer = require('./mailer');

var sandbox = sinon.sandbox.create();

describe('users', ()=>{
    let findStub;
    let sampleArgs;
    let deleteStub;
    let sampleUser;

    beforeEach(()=>{
        sampleUser =  {
            id: 123,
            name: 'foo',
            email: 'foo@bar.com'
        }
        findStub = sandbox.stub(mongoose.Model, 'findById').resolves(sampleUser);
        deleteStub = sandbox.stub(mongoose.Model, 'remove').resolves('fake_remove_result');
    })

    afterEach(()=>{
        sandbox.restore();
    })

    context('get', ()=>{
        it('should check for an id', (done)=>{
            users.get(null, (err, result)=>{
                expect(err).to.exist;
                expect(err.message).to.equal('Invalid user id');
                done();
            })
        })


        it('should call findUserById with id and return result', (done)=>{
            sandbox.restore();
            let stub = sandbox.stub(mongoose.Model, 'findById').yields(null, {name: 'foo'});

            users.get(123, (err, result)=>{
                expect(err).to.not.exist;
                expect(stub).to.have.been.calledOnce;
                expect(stub).to.have.been.calledWith(123);
                expect(result).to.be.a('object');
                expect(result).to.have.property('name').to.equal('foo');

                done();
            })
        })

        it('should catch an error if there is one', (done)=>{
            sandbox.restore();
            let stub = sandbox.stub(mongoose.Model, 'findById').yields(new Error('fake'));

            users.get(123, (err, result)=>{
                expect(result).to.not.exist;
                expect(err).to.exist;
                expect(err).to.be.instanceOf(Error);
                expect(stub).to.have.been.calledWith(123);
                expect(err.message).to.equal('fake');

                done();
            })
        })
    })

    context('delete user', ()=>{
        it('should check for an id using return', ()=>{
            return users.delete().then((result)=>{
                throw new Error('unexpected success');
            }).catch((ex)=>{
                expect(ex).to.be.instanceOf(Error);
                expect(ex.message).to.equal('Invalid id');
            })
        })

        it('should check for error using eventually', ()=>{
            return expect(users.delete()).to.eventually.be.rejectedWith('Invalid id');
        })

        it('should call users.remove', async ()=>{
            let result = await users.delete(123);

            expect(result).to.equal('fake_remove_result');
            expect(deleteStub).to.have.been.calledWith({_id: 123});
        })
    })
})