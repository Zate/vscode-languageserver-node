import * as rpc from '../main';
import * as net from 'net';

let LOG_MESSAGE_PREFIX = 'server.ts -';

let logger: rpc.Logger = {
    error: (message: string) => {
        console.log('%s error: %s', LOG_MESSAGE_PREFIX, message);
    },
    warn: (message: string) => {
        console.log('%s warn: %s', LOG_MESSAGE_PREFIX, message);
    },
    info: (message: string) => {
        console.log('%s info: %s', LOG_MESSAGE_PREFIX, message);
    },
    log: (message: string) => {
        console.log('%s log: %s', LOG_MESSAGE_PREFIX, message);
    }
};

let server = net.createServer((c) => {
    console.log('%s client connected', LOG_MESSAGE_PREFIX);

    let reader = new rpc.StreamMessageReader(c);
    let writer = new rpc.StreamMessageWriter(c);
    let connection = rpc.createMessageConnection(
        reader,
        writer,
        logger);
    let notification: rpc.NotificationType<string, void> = {
        method: 'testNotification',
        _: undefined,
    };
    connection.onNotification(notification, (param: string) => {
        // This prints Hello World
        console.log('%s onNotification: %s', LOG_MESSAGE_PREFIX, param);
    });
    connection.listen();

    c.on('end', () => {
        console.log('%s client disconnected', LOG_MESSAGE_PREFIX);
    });
    //c.write('hello\r\n');
    //c.pipe(c);
});
server.on('error', (err) => {
    console.error('%s error: %O', LOG_MESSAGE_PREFIX, err);
    console.error('%s error: %s', LOG_MESSAGE_PREFIX, err);
    throw err;
});
server.listen(1337, () => {
    console.log('%s server bound', LOG_MESSAGE_PREFIX);
});

