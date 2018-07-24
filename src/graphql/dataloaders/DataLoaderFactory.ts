import * as DataLoader from 'dataloader'

import { IUserInstance } from '../../models/MUser'
import { IDbConnection } from "../../interfaces/IDbConnection";
import { IDataLoaders } from "../../interfaces/IDataLoaders";
import { UserLoader } from "./UserLoader";
import { IPostInstance } from '../../models/MPost';
import { PostLoader } from './PostLoader';

export class DataLoaderFactory {
    constructor(private db: IDbConnection){}

    getLoaders(): IDataLoaders {
        return {
            userLoader: new DataLoader<number, IUserInstance>(
                (ids: number[]) => UserLoader.batchUsers(this.db.User, ids)
            ),
            postLoader: new DataLoader<number, IPostInstance>(
                (ids: number[]) => PostLoader.batchPosts(this.db.Post, ids)
            )
        }
    }
}