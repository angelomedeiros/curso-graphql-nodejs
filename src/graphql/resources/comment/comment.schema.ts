const commentTypes = `

    # Comments definitation types
    type Comment {
        id: ID!
        comment: String!
        createdAt: String!
        updatedAt: String!
        user: User!
        post: Post!
    }

    input CommentInput {
        comment: String!
        post: Int!
        user: Int!
    }
    
`

const commentQueries = `
    commentsByPost(post: ID!, first: Int, offeset: Int): [ Comment! ]!
`

const commentMutations = `
    createComment(input: CommentInput!): Comment
    updateComment(id: ID!, input: CommentInput!): Comment
    deleteComment(id: ID!): Boolean
`

export {
    commentTypes,
    commentQueries,
    commentMutations
}