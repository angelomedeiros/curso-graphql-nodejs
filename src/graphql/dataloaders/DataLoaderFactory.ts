import * as DataLoader from 'dataloader'

import { IUserInstance } from '../../models/MUser'
import { IDbConnection } from "../../interfaces/IDbConnection";
import { IDataLoaders } from "../../interfaces/IDataLoaders";
import { UserLoader } from "./UserLoader";
import { IPostInstance } from '../../models/MPost';
import { PostLoader } from './PostLoader';
import { RequestedFields } from '../ast/RequestedFields';
import { IDataLoaderParam } from '../../interfaces/IDataLoaderParam';

export class DataLoaderFactory {
    constructor(
        private db: IDbConnection,
        private requestedFields: RequestedFields
    ){}

    getLoaders(): IDataLoaders {
        return {
            userLoader: new DataLoader<IDataLoaderParam<number>, IUserInstance>(
                (params: IDataLoaderParam<number>[]) => UserLoader.batchUsers(this.db.User, params, this.requestedFields),
                { cacheKeyFn: (param: IDataLoaderParam<number[]>) =>  param.key}
            ),
            postLoader: new DataLoader<IDataLoaderParam<number>, IPostInstance>(
                (params: IDataLoaderParam<number>[]) => PostLoader.batchPosts(this.db.Post, params, this.requestedFields),
                { cacheKeyFn: (param: IDataLoaderParam<number[]>) =>  param.key}
            )
        }
    }
}