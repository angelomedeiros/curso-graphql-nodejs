import { IDbConnection } from '../../../interfaces/IDbConnection'
import { IPostInstance } from '../../../models/MPost'

export const postResolvers = {

    Post: {
        author: (post, args, {db}: {db: IDbConnection}, info) => {
            return db.User
                     .findById(post.get('author'))
        },

        comments: (post, {first = 10, offset = 0}, {db}: {db: IDbConnection}, info) => {
            return db.Comment
                     .findAll({
                         where: { post: post.get('id') },
                         limit: first,
                         offset: offset
                     })
        }
    },

    Query: {
        posts: (parent, {first = 10, offset = 0}, {db}: {db: IDbConnection}, info) => {
            return db.Post
                     .findAll({
                         limit: first,
                         offset: offset
                     })
        },

        post: (parent, {id}, {db}: {db: IDbConnection}, info) => {
            return db.Post
                     .findById(id)
                     .then((post: IPostInstance) => {
                        if (!post) throw new Error(`Post with id ${id} not found!`)
                        return post
                     })
        },
    }
}