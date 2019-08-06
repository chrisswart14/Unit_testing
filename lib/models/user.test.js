const chai = require('chai');
const expect = chai.expect;

var User = require('./user');

describe('User model', ()=>{
    it('should return error is requried ares are missing', (done)=>{
        let user = new User();
        
        user.validate((err)=>{  //built in mongoose function lets you validate an instance that you try to create, if any problems exist it will return an error object and indside the object is a property and for each missing field it will add a field name as a prop
            expect(err.errors.name).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.age).to.not.exist;

            done();
        })
    })

    it('should have optional age field', (done)=>{
        let user = new User({
            name: 'foo',
            email: 'foo@bar.com',
            age: 35
        })

        expect(user).to.have.property('age').to.equal(35);
        done();
    })
})