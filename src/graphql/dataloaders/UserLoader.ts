import { IUserInstance, IUserModel } from '../../models/MUser'

export class UserLoader {
    
    static batchUsers(User: IUserModel, ids: number[]): Promise<IUserInstance[]> {
        return <any>Promise.resolve(
            User.findAll({
                where: { id: { $in: ids } }
            })
        )
    }

}