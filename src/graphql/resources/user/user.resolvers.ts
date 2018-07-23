import { GraphQLResolveInfo } from "graphql";
import { IDbConnection } from '../../../interfaces/IDbConnection'
import { IUserInstance } from "../../../models/MUser";

export const userResolvers = {

    Query: {
        users: (parent, { first = 10, offset = 0 }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            return db.User
                     .findAll({
                         limit: first,
                         offset: offset
                     })
        },

        user: (parent, { id }, { db }: { db: IDbConnection }, info: GraphQLResolveInfo) => {
            return db.User.findById(id)
                          .then((user: IUserInstance) => {
                              if (!user) throw new Error(`User with id ${id} not found`)
                              return user
                          })
        }
    }

}