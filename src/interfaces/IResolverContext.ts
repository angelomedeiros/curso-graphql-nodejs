import { IDbConnection } from "./IDbConnection";
import { IAuthUser } from "./IAuthUser";
import { IDataLoaders } from "./IDataLoaders";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export interface IResolverContext {
    db?: IDbConnection
    authorization?: string
    authUser?: IAuthUser
    dataloaders?: IDataLoaders
    requestedFields?: RequestedFields
}