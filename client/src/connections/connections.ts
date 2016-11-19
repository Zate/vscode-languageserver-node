import {
    MessageReader, WebSocketMessageReader,
    MessageWriter, WebSocketMessageWriter,
    WebSocketConnectionOptions, WebSocketConnection
} from 'vscode-jsonrpc';
import * as WebSocket from 'ws';

export type ConnectionDuplex = {
    reader: MessageReader,
    writer: MessageWriter
};

export class Connections {
    private constructor() {
    }

    public static newWebSocket(): Promise<ConnectionDuplex> {
        let options: WebSocketConnectionOptions = {
            secure: false,
            host: 'localhost',
            port: '4389'
        };
        let ws = new WebSocketConnection(options);

        return ws.connection.then((socket: WebSocket) => {
            let reader = new WebSocketMessageReader(socket);
            let writer = new WebSocketMessageWriter(socket);

            return {
                reader,
                writer
            };
        });
    }
}