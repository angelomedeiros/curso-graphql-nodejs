import * as jwt                 from 'jsonwebtoken'
import { GraphQLFieldResolver } from "graphql";

import { IResolverContext }     from "../../interfaces/IResolverContext";
import { ComposableResolver }   from "./composable.resolver";
import { JWT_SECRET }           from "../../utils/utils";

export const verifyTokenResolver: ComposableResolver<any, IResolverContext> = 
    (resolver: GraphQLFieldResolver<any, IResolverContext>): GraphQLFieldResolver<any, IResolverContext> => {
        
        return (parent, args, context: IResolverContext, info) => {

            const token: string = context.authorization ? context.authorization.split(' ')[1] : undefined

            return jwt.verify(token, JWT_SECRET, (err, decoded: any) => {

                if (!err) {
                    return resolver(parent, args, context, info)
                }

                throw new Error(`${err.name}: ${err.message}`)

            })

        }

    }