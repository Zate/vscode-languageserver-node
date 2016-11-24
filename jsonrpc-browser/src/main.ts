/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as Common from 'vscode-jsonrpc-common';
import {
	WebSocketConnection, WebSocketConnectionOptions,
	WebSocketMessageReader, WebSocketMessageWriter
} from './websocket-connection/websocket-connection';

export {
	WebSocketConnection, WebSocketConnectionOptions,
	WebSocketMessageReader, WebSocketMessageWriter
};

export function createMessageConnection(reader: WebSocketMessageReader, writer: WebSocketMessageWriter, logger: Common.Logger): Common.MessageConnection {
	return Common.createMessageConnection(reader, writer, logger);
}