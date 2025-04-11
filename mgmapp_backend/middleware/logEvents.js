const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = fs.promises; //require('fs').promises;
const path = require('path');

const logEvents = async (message, logname) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`;
    const logItem = `${dateTime}\t\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logname), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.url} - ${req.method} - ${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} - ${req.path}`);
    next();
}

module.exports = { logger, logEvents};