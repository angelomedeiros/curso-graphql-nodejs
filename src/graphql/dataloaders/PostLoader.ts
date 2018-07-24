import { IPostModel, IPostInstance } from "../../models/MPost";

export class PostLoader {

    static batchPosts(Post: IPostModel, ids: number[]): Promise<IPostInstance[]> {
        return (Promise as any).resolve(
            Post.findAll({
                where: { id: { $in: ids } }
            })
        )
    }

}