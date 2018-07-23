import { makeExecutableSchema } from 'graphql-tools'

const users: any[] = [
    {
        id: 1,
        name: 'Angelo',
        email: 'angelo@medeiros.com'
    },
    {
        id: 2,
        name: 'gabriel',
        email: 'gabriel@medeiros.com'
    }
]

const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        allUsers: [User!]
    }
`

const resolvers = {
    Query: {
        allUsers: () => users
    }
}

export default makeExecutableSchema({typeDefs, resolvers})