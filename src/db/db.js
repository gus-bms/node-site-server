const {dbHost, dbUser, dbPassword} = require('../config.json');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: dbHost, 
     user: dbUser, 
     password: dbPassword,
     port: 3306,
     database: 'site',
     charset: 'utf8mb4',
     connectionLimit: 1000
});

exports.connection = (async function () {
    try {
        var pool = await mysql.createPool(dbConfig);
        logger.debug('pool created')
        pool.on('acquire', function (connection) {
            // logger.debug(`Connection ${connection.threadId} acquired connection count - ${++connectionCount}`);
        });
        pool.on('connection', function (connection) {
            // logger.debug(`Connection ${connection.threadId} created connection count - ${connectionCount}`);
        });
        pool.on('enqueue', function () {
            // logger.debug('Waiting for available connection slot');
        });
        pool.on('release', function (connection) {
            // logger.debug(`Connection ${connection.threadId} released connection count - ${--connectionCount}`);
        });

        return pool
    } catch (e) {
        logger.error('Failed to make all database connections!',e);
        slack.sendToCrashReportNode(e);
        throw e;
    }
})();