import { GraphQLResolveInfo }      from "graphql";
import { Transaction }             from "sequelize";

import { IDbConnection }           from '../../../interfaces/IDbConnection'
import { IUserInstance }           from "../../../models/MUser";
import { handleError, throwError } from "../../../utils/utils";
import { compose }                 from "../../composable/composable.resolver";
import { IAuthUser }               from "../../../interfaces/IAuthUser";
import { authResolvers }           from "../../composable/auth.resolver";

export const userResolvers = {

    User: {
        posts: (user: IUserInstance, { first = 10, offset = 0 }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
           return db.Post
                    .findAll({
                        where: {author: user.get('id')},
                        limit: first,
                        offset: offset
                    })
                    .catch(handleError)
        }
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            return db.User
                     .findAll({
                         limit: first,
                         offset: offset
                     })
                     .catch(handleError)
        },

        user: (parent, { id }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.User.findById(id)
                          .then((user: IUserInstance) => {
                              throwError(!user, `User with id ${id} not found`)
                              return user
                          })
                          .catch(handleError)
        },

        currentUser: compose(...authResolvers)((parent, args, { db, authUser }: { db: IDbConnection, authUser: IAuthUser }, info: GraphQLResolveInfo) => {
            return db.User
                    .findById(authUser.id)
                    .then((user: IUserInstance) => {
                        throwError(!user, `User with id ${authUser.id} not found`)
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