import * as  Sequelize from 'sequelize'
import { IBaseModel } from '../interfaces/IBaseModel';
import { IModels } from '../interfaces/IModels';

export interface ICommmentAttributes {
    id?: number
    comment?: string
    post?: number
    user?: number
    createdAt?: string
    updatedAt?: string
}

export interface ICommnetInstance extends Sequelize.Instance<ICommmentAttributes> {}

export interface ICommentModel extends IBaseModel, Sequelize.Model<ICommnetInstance, ICommmentAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes):  ICommentModel => {
    
    const Comment: ICommentModel = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'comments'
    })

    Comment.associate = (models: IModels): void => {
        Comment.belongsTo(models.Post, {
            foreignKey: {
                allowNull: false,
                field: 'post',
                name: 'post'
            }
        })

        Comment.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        })
    }

    return Comment
}