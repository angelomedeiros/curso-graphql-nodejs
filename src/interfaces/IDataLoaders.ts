import * as DataLoader from 'dataloader'
import { IUserInstance } from '../models/MUser'
import { IPostInstance } from '../models/MPost';
import { IDataLoaderParam } from './IDataLoaderParam';

export interface IDataLoaders {

    userLoader: DataLoader<IDataLoaderParam<number>, IUserInstance>
    postLoader: DataLoader<IDataLoaderParam<number>, IPostInstance>

}