import { IUserInstance, IUserModel } from '../../models/MUser'
import { IDataLoaderParam } from '../../interfaces/IDataLoaderParam';
import { RequestedFields } from '../ast/RequestedFields';

export class UserLoader {
    
    static batchUsers(User: IUserModel, params: IDataLoaderParam<number>[], requestedFields: RequestedFields): Promise<IUserInstance[]> {
        
        let ids: number[] = params.map(param => param.key)
        
        return <any>Promise.resolve(
            User.findAll({
                where: { id: { $in: ids } },
                attributes: requestedFields.getFields(params[0].info, { keep: ['id'], exclude: ['posts'] })
            })
        )
    }

}