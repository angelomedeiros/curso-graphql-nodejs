import { IPostModel, IPostInstance } from "../../models/MPost";
import { IDataLoaderParam } from "../../interfaces/IDataLoaderParam";
import { RequestedFields } from "../ast/RequestedFields";

export class PostLoader {

    static batchPosts(Post: IPostModel, params: IDataLoaderParam<number>[], requestedFields: RequestedFields): Promise<IPostInstance[]> {
        
        let ids: number[] = params.map(param => param.key)

        return (Promise as any).resolve(
            Post.findAll({
                where: { id: { $in: ids } },
                attributes: requestedFields.getFields(params[0].info, { keep: ['id'], exclude: ['comments'] })
            })
        )
    }

}