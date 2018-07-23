import { IModels } from "./IModels";

export interface IBaseModel {
    prototype?
    associate?(models: IModels): void
}