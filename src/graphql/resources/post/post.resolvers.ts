import { Transaction } from 'sequelize';
import * as graphqlFields from 'graphql-fields'

import { IDbConnection } from '../../../interfaces/IDbConnection'
import { IPostInstance } from '../../../models/MPost'
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';
import { authResolvers } from '../../composable/auth.resolver';
import { IAuthUser } from '../../../interfaces/IAuthUser';
import { IDataLoaders } from '../../../interfaces/IDataLoaders';
import { IResolverContext } from '../../../interfaces/IResolverContext';

export const postResolvers = {

    Post: {
        author: (post, args, {db, dataloaders: { userLoader }}: {db: IDbConnection, dataloaders: IDataLoaders}, info) => {
            return userLoader
                        .load(post.get('author'))
                        .catch(handleError)
        },

        comments: (post, {first = 10, offset = 0}, context: IResolverContext, info) => {
            return context.db.Comment
                     .findAll({
                         where: { post: post.get('id') },
                         limit: first,
                         offset: offset,
                         attributes: context.requestedFields.getFields(info)
                     })
                     .catch(handleError)
        }
    },

    Query: {
        posts: (parent, {first = 10, offset = 0}, context: IResolverContext, info) => {
            return context.db.Post
                     .findAll({
                         limit: first,
                         offset: offset,
                         attributes: context.requestedFields.getFields(info, { keep: ['id'], exclude: ['comments'] })
                     })
                     .catch(handleError)
        },

        post: (parent, {id}, context: IResolverContext, info) => {
            id = parseInt(id)
            return context.db.Post
                     .findById(id, {
                        attributes: context.requestedFields.getFields(info, { keep: ['id'], exclude: ['comments'] })
                     })
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