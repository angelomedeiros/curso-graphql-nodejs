import { IDbConnection } from "./IDbConnection";
import { IAuthUser } from "./IAuthUser";

export interface IResolverContext {
    db?: IDbConnection
    authorization?: string
    user?: IAuthUser
}