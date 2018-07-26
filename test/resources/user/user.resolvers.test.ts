import { db, app, chai, handleError, expect } from './../../test-utils'

describe('user', () => {

    beforeEach(() => {
        return db.Comment.destroy({where: {}})
                 .then((rows: number) => db.Post.destroy({where: {}}))
                 .then((rows: number) => db.User.destroy({where: {}}))
                 .then((rows: number) => db.User.create({
                     name: 'Albert Einstein',
                     email: 'albert@mr.com',
                     password: 'e=mc2'
                 }))
    })

    describe('Queries', () => {

        describe('application/json', () => {

            describe('users', () => {

                it('Deve retornar uma lista de usário', () => {

                    let body = {
                        query: `
                            query {
                                users {
                                    name
                                    email
                                }
                            }
                        `                    
                    }

                    return chai.request(app)
                               .post('/')
                               .set('content-type', 'application/json')
                               .send(JSON.stringify(body))
                               .then( res => {
                                    const userList = res.body.data.users
                                    expect(res.body.data).to.be.an('object')
                                    expect(userList).to.be.an('array').of.length(1)
                                    expect(userList[0]).to.not.have.keys(['id','photo','createdAt','updatedAt','posts'])
                                    expect(userList[0]).to.have.keys(['name','email'])
                               }).catch(handleError)

                })

            })

        })

    })
})