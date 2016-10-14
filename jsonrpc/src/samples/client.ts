import * as cp from 'child_process';
import * as rpc from '../main';
import * as net from 'net';

let LOG_MESSAGE_PREFIX = 'client.ts -';

let connectOpts = {
    port: 1337
};
let client;

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

client = net.connect(connectOpts, () => {
    client.setKeepAlive(true, 60000); //1 min = 60000 milliseconds.

    console.log('%s connected to server!', LOG_MESSAGE_PREFIX);

    let reader = new rpc.StreamMessageReader(client);
    let writer = new rpc.StreamMessageWriter(client);

    let connection = rpc.createMessageConnection(reader, writer, logger);
    let notification: rpc.NotificationType<string, void> = {
        method: 'testNotification',
        _: undefined,
    };

    connection.listen();
    connection.sendNotification(notification, 'Hello World');
});
