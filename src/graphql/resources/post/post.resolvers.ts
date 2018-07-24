import { IDbConnection } from '../../../interfaces/IDbConnection'
import { IPostInstance } from '../../../models/MPost'
import { Transaction } from 'sequelize';
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';
import { authResolvers } from '../../composable/auth.resolver';
import { IAuthUser } from '../../../interfaces/IAuthUser';

export const postResolvers = {

    Post: {
        author: (post, args, {db}: {db: IDbConnection}, info) => {
            return db.User
                     .findById(post.get('author'))
                     .catch(handleError)
        },

        comments: (post, {first = 10, offset = 0}, {db}: {db: IDbConnection}, info) => {
            return db.Comment
                     .findAll({
                         where: { post: post.get('id') },
                         limit: first,
                         offset: offset
                     })
                     .catch(handleError)
        }
    },

    Query: {
        posts: (parent, {first = 10, offset = 0}, {db}: {db: IDbConnection}, info) => {
            return db.Post
                     .findAll({
                         limit: first,
                         offset: offset
                     })
                     .catch(handleError)
        },

        post: (parent, {id}, {db}: {db: IDbConnection}, info) => {
            id = parseInt(id)
            return db.Post
                     .findById(id)
                     .then((post: IPostInstance) => {
                        if (!post) throw new Error(`Post with id ${id} not found!`)
                        return post
                     })
                     .catch(handleError)
        },
    },

    Mutation: {
        createPost: compose(...authResolvers)((parent, { input }, {db, authUser}: {db: IDbConnection, authUser: IAuthUser}, info) => {
            input.author = authUser.id
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, {transaction: t})
            }).catch(handleError)
        }),

        updatePost: compose(...authResolvers)((parent, { id, input }, {db, authUser}: {db: IDbConnection, authUser: IAuthUser}, info) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post
                .findById(id)
                .then((post: IPostInstance) => {       
                    throwError(!post, `Post with id ${id} not found!`)
                    throwError(post.get('author') != authUser.id, `Não autorizado: Você só pode alterar posts de sua autoria`)
                    input.author = authUser.id
                    return post.update(input, {transaction: t})
                })
            }).catch(handleError)
        }),

        deletePost: compose(...authResolvers)((parent, { id }, {db, authUser}: {db: IDbConnection, authUser: IAuthUser}, info) => {
            id = parseInt(id)
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post
                    .findById(id)
                    .then((post: IPostInstance) => {
                        throwError(!post, `Post with id ${id} not found!`)
                        throwError(post.get('author') != authUser.id, `Não autorizado: Você só pode deletar posts de sua autoria`)
                        return post.destroy({transaction: t})
                            .then(post => !!post)
                    })
            }).catch(handleError)
        })
    }
}