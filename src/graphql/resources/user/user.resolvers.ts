import { GraphQLResolveInfo } from "graphql";
import { IDbConnection }      from '../../../interfaces/IDbConnection'
import { IUserInstance }      from "../../../models/MUser";
import { Transaction }        from "sequelize";
import { handleError }        from "../../../utils/utils";
import { compose }            from "../../composable/composable.resolver";
import { authResolver }       from "../../composable/auth.resolver";
import { verifyTokenResolver } from "../../composable/verifyToken.resolver";

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
        users: compose(authResolver, verifyTokenResolver)((parent, { first = 10, offset = 0 }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            return db.User
                     .findAll({
                         limit: first,
                         offset: offset
                     })
                     .catch(handleError)
        }),

        user: (parent, { id }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.User.findById(id)
                          .then((user: IUserInstance) => {
                              if (!user) throw new Error(`User with id ${id} not found`)
                              return user
                          })
                          .catch(handleError)
        }
    },

    Mutation: {

        createUser: (parent, args, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(args.input, { transaction: t })
            }).catch(handleError)
        },

        updateUser: (parent, { id, input }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            id =  parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                         .findById(id)
                         .then((user: IUserInstance) => {
                            if (!user) throw new Error(`User with id ${id} not found`)
                            return user.update(input, { transaction: t })
                         })
            }).catch(handleError)
        },

        updateUserPassword: (parent, { id, input }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            id =  parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                         .findById(id)
                         .then((user: IUserInstance) => {
                            if (!user) throw new Error(`User with id ${id} not found`)
                            return user.update(input, { transaction: t })
                                       .then((user: IUserInstance) => !!user)
                         })
            }).catch(handleError)
        },

        deleteUser: (parent, { id }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            id =  parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                         .findById(id)
                         .then((user: IUserInstance) => {
                            if (!user) throw new Error(`User with id ${id} not found`)
                            return user.destroy({transaction: t}).then(user => !!user)
                         })
            }).catch(handleError)
        }

    }

}