import * as http from 'http'
import app from './app'
import { normalizePort, onError, onListening } from './utils/utils';
import db from './models'

const server = http.createServer(app)
const port = normalizePort(process.env.port || 3000)
const host = process.env.host || '127.0.0.1'

db.sequelize.sync()
            .then(() => {
                server.listen(port, host)
                server.on('error', onError(server))
                server.on('listening', onListening(server))
            })

