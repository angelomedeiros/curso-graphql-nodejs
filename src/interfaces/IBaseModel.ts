import { IModel } from "./IModel";

export interface IBaseModel {
    prototype?
    associate?(models: IModel): void
}