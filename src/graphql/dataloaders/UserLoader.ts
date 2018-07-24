import { IUserInstance, IUserModel } from '../../models/MUser'
import * as Bluebird from 'bluebird'

export class UserLoader {
    
    static batchUsers(User: IUserModel, ids: number[]): Bluebird<IUserInstance[]> {
        return Bluebird.resolve(
            User.findAll({
                where: { id: { $in: ids } }
            })
        )
    }

}