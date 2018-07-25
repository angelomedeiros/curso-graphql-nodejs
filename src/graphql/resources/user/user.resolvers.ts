import { GraphQLResolveInfo }      from "graphql";
import { Transaction }             from "sequelize";

import { IDbConnection }           from '../../../interfaces/IDbConnection'
import { IUserInstance }           from "../../../models/MUser";
import { handleError, throwError } from "../../../utils/utils";
import { compose }                 from "../../composable/composable.resolver";
import { IAuthUser }               from "../../../interfaces/IAuthUser";
import { authResolvers }           from "../../composable/auth.resolver";
import { RequestedFields } from "../../ast/RequestedFields";
import { IResolverContext } from "../../../interfaces/IResolverContext";

export const userResolvers = {

    User: {
        posts: (user: IUserInstance, { first = 10, offset = 0 }, { db, requestedFields }: { db: IDbConnection, requestedFields: RequestedFields }, info: GraphQLResolveInfo) => {
            console.log(info.fieldName, info.fieldNodes)
            return db.Post
                    .findAll({
                        where: {author: user.get('id')},
                        limit: first,
                        offset: offset,
                        attributes: requestedFields.getFields(info, { keep: ['id'], exclude: ['comments'] })
                    })
                    .catch(handleError)
        }
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, { db, requestedFields }: { db: IDbConnection, requestedFields: RequestedFields }, info: GraphQLResolveInfo) => {
            return db.User
                     .findAll({
                         limit: first,
                         offset: offset,
                         attributes: requestedFields.getFields(info, { keep: ['id'], exclude: ['comments'] })
                     })
                     .catch(handleError)
        },

        user: (parent, { id }, context: IResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return context.db.User.findById(id, {
                               attributes: context.requestedFields.getFields(info, { keep: ['id'], exclude: ['comments'] })
                          })
                          .then((user: IUserInstance) => {
                              throwError(!user, `User with id ${id} not found`)
                              return user
                          })
                          .catch(handleError)
        },

        currentUser: compose(...authResolvers)((parent, args, context: IResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User
                    .findById(context.authUser.id, {
                        attributes: context.requestedFields.getFields(info, { keep: ['id'], exclude: ['comments'] })
                    })
                    .then((user: IUserInstance) => {
                        throwError(!user, `User with id ${context.authUser.id} not found`)
                        return user;
                    }).catch(handleError)
        })
    },

    Mutation: {

        createUser: (parent, args, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(args.input, { transaction: t })
            }).catch(handleError)
        },

        updateUser: compose(...authResolvers)((parent, { input }, { db, authUser }: { db: IDbConnection, authUser: IAuthUser }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                         .findById(authUser.id)
                         .then((user: IUserInstance) => {
                            throwError(!user, `User with id ${authUser.id} not found`)
                            return user.update(input, { transaction: t })
                         })
            }).catch(handleError)
        }),

        updateUserPassword: compose(...authResolvers)((parent, { input }, { db, authUser }: { db: IDbConnection, authUser: IAuthUser }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                         .findById(authUser.id)
                         .then((user: IUserInstance) => {
                            throwError(!user, `User with id ${authUser.id} not found`)
                            return user.update(input, { transaction: t })
                                       .then((user: IUserInstance) => !!user)
                         })
            }).catch(handleError)
        }),

        deleteUser: compose(...authResolvers)((parent, args, { db, authUser }: { db: IDbConnection, authUser: IAuthUser }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                         .findById(authUser.id)
                         .then((user: IUserInstance) => {
                            throwError(!user, `User with id ${authUser.id} not found`)
                            return user.destroy({transaction: t}).then(user => !!user)
                         })
            }).catch(handleError)
        })

    }

}