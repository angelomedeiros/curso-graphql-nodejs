import { GraphQLFieldResolver } from "graphql";
import { IResolverContext }     from '../../interfaces/IResolverContext'
import { ComposableResolver }   from './composable.resolver'

export const authResolver: ComposableResolver<any, IResolverContext> = 
    (resolver: GraphQLFieldResolver<any, IResolverContext>): GraphQLFieldResolver<any, IResolverContext> => {
        
        return (parent, args, context: IResolverContext, info) => {

            if (context.authUser || context.authorization) {
                return resolver(parent, args, context, info)
            }

            throw new Error('Não autorizado: Token não fornecido')

        }

    }