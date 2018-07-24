import * as DataLoader from 'dataloader'
import { IUserInstance } from '../models/MUser'
import { IPostInstance } from '../models/MPost';

export interface DataLoaders {

    userLoader: DataLoader<number, IUserInstance>
    postLoader: DataLoader<number, IPostInstance>

}