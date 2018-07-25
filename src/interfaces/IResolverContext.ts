import { IDbConnection } from "./IDbConnection";
import { IAuthUser } from "./IAuthUser";
import { IDataLoaders } from "./IDataLoaders";

export interface IResolverContext {
    db?: IDbConnection
    authorization?: string
    authUser?: IAuthUser
    dataloaders?: IDataLoaders
}