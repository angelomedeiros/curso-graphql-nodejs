import { IDbConnection } from "../../../interfaces/IDbConnection";
import { Transaction } from "sequelize";
import { ICommnetInstance } from "../../../models/MComment";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { IAuthUser } from "../../../interfaces/IAuthUser";
import { IDataLoaders } from "../../../interfaces/IDataLoaders";
import { IResolverContext } from "../../../interfaces/IResolverContext";

export const commentResolvers = {

    Comment: {
        user: (comment, args, {db, dataloaders: { userLoader }}: {db: IDbConnection, dataloaders: IDataLoaders}, info) => {
            return userLoader
                        .load(comment.get('author'))
                        .catch(handleError)
        },
        post: (comment, args, {db, dataloaders: { postLoader }}: {db: IDbConnection, dataloaders: IDataLoaders}, info) => {
            return postLoader
                        .load(comment.get('post'))
                        .catch(handleError)
        },
    },

    Query: {
        commentsByPost: (parent, { postId, first = 10, offset = 0 }, context: IResolverContext , info) => {
            postId = parseInt(postId)
            return context.db.Comment
                     .findAll({
                         where: { post: postId },
                         limit: first,
                         offset: offset,
                         attributes: context.requestedFields.getFields(info)
                     })
                     .catch(handleError)
        }
    },

    Mutation: {
        createComment: compose(...authResolvers)((parent, { input }, {db, authUser}: {db: IDbConnection, authUser: IAuthUser} , info) => {
            input.user = authUser.id
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .create(input, { transaction: t })
            }).catch(handleError)
        }),
        updateComment: compose(...authResolvers)((parent, { id, input }, {db, authUser}: {db: IDbConnection, authUser: IAuthUser} , info) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: ICommnetInstance) => {
                        throwError(!comment, `Comment with id ${id} not found!`)
                        throwError(comment.get('user') != authUser.id, `Não autorizado: Você só pode alterar comments de sua autoria`)
                        input.user = authUser.id
                        return comment.update(input, { transaction: t })
                    })
            }).catch(handleError)
        }),
        deleteComment: compose(...authResolvers)((parent, { id }, {db, authUser}: {db: IDbConnection, authUser: IAuthUser} , info) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: ICommnetInstance) => {
                        throwError(!comment, `Comment with id ${id} not found!`)
                        throwError(comment.get('user') != authUser.id, `Não autorizado: Você só pode deletar comments de sua autoria`)
                        return comment.destroy({transaction: t})
                            .then(comment => !!comment)
                    })
            }).catch(handleError)
        })
    }
}