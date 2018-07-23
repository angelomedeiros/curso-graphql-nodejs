import * as express from 'express'

class App {
    public express: express.Application

    constructor () {
        this.express = express()
        this.middleware()
    }

    private middleware() {
        this.express.use('/hello', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.send({
                hello: 'Hello world!'
            })
        })
    }
}

export default new App().express;