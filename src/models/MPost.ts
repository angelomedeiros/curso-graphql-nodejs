import * as Sequelize from "sequelize";
import { IBaseModel } from '../interfaces/IBaseModel'
import { IModels } from "../interfaces/IModels";

export interface IPostAttributes {
    id?: number
    title?: string
    content?: string
    photo?: string
    author?: number
    createdAt?: string
    updatedAt?: string
}

export interface IPostInstance extends Sequelize.Instance<IPostAttributes> {}

export interface IPostModel extends IBaseModel, Sequelize.Model<IPostInstance, IPostAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): IPostModel => {
    const Post: IPostModel = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        photo: {
            type: DataTypes.BLOB({
                length: 'long'
            }),
            allowNull: false
        }
    }, {
        tableName: 'posts'
    })

    Post.associate = (models: IModels): void => {
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'author',
                name: 'author'
            }
        })
    }

    return Post
}