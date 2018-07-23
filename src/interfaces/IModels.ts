import { IUserModel } from "../models/MUser";
import { IPostModel } from '../models/MPost'
import { ICommentModel } from '../models/MComment'

export interface IModels {
   User: IUserModel,
   Post: IPostModel,
   Comment: ICommentModel
}