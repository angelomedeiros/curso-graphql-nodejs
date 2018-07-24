import { IDbConnection } from "../../../interfaces/IDbConnection";
import { Transaction } from "sequelize";
import { ICommnetInstance } from "../../../models/MComment";
import { handleError } from "../../../utils/utils";

export const commentResolvers = {

    Comment: {
        user: (comment, args, {db}: {db: IDbConnection} , info) => {
            return db.User
                     .findById(comment.get('user'))
                     .catch(handleError)
        },
        post: (comment, args, {db}: {db: IDbConnection} , info) => {
            return db.Post
                     .findById(comment.get('post'))
                     .catch(handleError)
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
                     .catch(handleError)
        }
    },

    Mutation: {
        createComment: (parent, { input }, {db}: {db: IDbConnection} , info) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                         .create(input, { transaction: t })
            }).catch(handleError)
        },
        updateComment: (parent, { id, input }, {db}: {db: IDbConnection} , info) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                         .findById(id)
                         .then((comment: ICommnetInstance) => {
                             if (!comment) throw new Error(`Comment with id ${id} not found`)
                             return comment.update(input, { transaction: t })
                         })
            }).catch(handleError)
        },
        deleteComment: (parent, { id }, {db}: {db: IDbConnection} , info) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                         .findById(id)
                         .then((comment: ICommnetInstance) => {
                             if (!comment) throw new Error(`Comment with id ${id} not found`)
                             return comment.destroy({transaction: t})
                                           .then(comment => !!comment)
                         })
            }).catch(handleError)
        }
    }
}