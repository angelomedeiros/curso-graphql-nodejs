import { IDbConnection } from "../../../interfaces/IDbConnection";

export const commentResolvers = {

    Comment: {
        user: (comment, args, {db}: {db: IDbConnection} , info) => {
            return db.User
                     .findById(comment.get('user'))
        },
        post: (comment, args, {db}: {db: IDbConnection} , info) => {
            return db.Post
                     .findById(comment.get('post'))
        },
    },

    Query: {
        commentsByPost: (parent, { postId, first = 10, offset = 0 }, {db}: {db: IDbConnection} , info) => {
            return db.Comment
                     .findAll({
                         where: { post: postId },
                         limit: first,
                         offset: offset
                     })
        }
    }
}