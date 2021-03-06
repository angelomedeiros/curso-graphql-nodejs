import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors'
import * as compression from 'compression'
import * as helmet from 'helmet'

import db from './models'
import { extractJwtMiddleware } from './middlewares/extractJwtMiddleware'

import schema from './graphql/schema'
import { DataLoaderFactory } from './graphql/dataloaders/DataLoaderFactory';
import { RequestedFields } from './graphql/ast/RequestedFields';

class App {

    public express: express.Application
    private dataLoaderFactory: DataLoaderFactory
    private requestedFields: RequestedFields

    constructor () {
        this.express = express()
        this.init()
    }

    private init(): void {
        this.requestedFields = new RequestedFields()
        this.dataLoaderFactory = new DataLoaderFactory(db, this.requestedFields)
        this.middleware()
    }

    private middleware() {

        this.express.use(cors({
            origin: '*',
            methods: ['GET','POST'],
            allowedHeaders: ['Content-type', 'Authorization','Accept-Enconding'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        }))

        this.express.use(compression())

        this.express.use(helmet())

        this.express.use('/',

            extractJwtMiddleware(),

            (req, res, next) => {
                req['context']['db'] = db
                req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders()
                req['context']['requestedFields'] = this.requestedFields
                next()
            },

            graphqlHTTP((req) => ({
                schema,
                graphiql: process.env.NODE_ENV === 'development',
                context: req['context']
            }))
        )
    }

}

export default new App().express;