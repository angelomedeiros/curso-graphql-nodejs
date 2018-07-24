import { IPostModel, IPostInstance } from "../../models/MPost";
import * as Bluebird from 'bluebird'

export class PostLoader {

    static batchPosts(Post: IPostModel, ids: number[]): Bluebird<IPostInstance[]> {
        return Bluebird.resolve(
            Post.findAll({
                where: { id: { $in: ids } }
            })
        )
    }

}