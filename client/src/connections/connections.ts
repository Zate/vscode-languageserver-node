import {
    MessageReader, WebSocketMessageReader,
    MessageWriter, WebSocketMessageWriter,
    WebSocketConnectionOptions, WebSocketConnection
} from 'vscode-jsonrpc';
import * as SocketIOClient from 'socket.io-client';

export type ConnectionDuplex = {
    reader: MessageReader,
    writer: MessageWriter
};

export class Connections {
    private constructor() {
    }

    public static newWebSocket(): Promise<ConnectionDuplex> {
        return this.newWebSocketConnection().listen().then((socket: SocketIOClient.Socket) => {
            let reader = new WebSocketMessageReader(socket);
            let writer = new WebSocketMessageWriter(socket);

            return {
                reader,
                writer
            };
        });
    }


    public static newIPC(command: any): Promise<ConnectionDuplex> {
        // TODO: Needs implementing.
        return Promise.reject<ConnectionDuplex>(new Error(`Unsupported server configuartion ` + JSON.stringify(command, null, 4)));
    }

    private static newWebSocketConnection(): WebSocketConnection {
        let options: WebSocketConnectionOptions = {
            secure: false,
            host: 'localhost',
            port: '4389',
            // namespace: '',
            // path: ''
        };
        return new WebSocketConnection(options);
    }
}