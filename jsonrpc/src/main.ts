/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="./thenable.ts" />
'use strict';

import * as is from './is';

import * as Common from 'vscode-jsonrpc-common';
import { StreamMessageReader, IPCMessageReader } from './messageReader';
import { StreamMessageWriter, IPCMessageWriter } from './messageWriter';
export {
	StreamMessageReader, IPCMessageReader,
	StreamMessageWriter, IPCMessageWriter
};

function isMessageReader(value: any): value is Common.MessageReader {
	return is.defined(value.listen) && is.undefined(value.read);
}

function isMessageWriter(value: any): value is Common.MessageWriter {
	return is.defined(value.write) && is.undefined(value.end);
}

export function createMessageConnection(reader: Common.MessageReader, writer: Common.MessageWriter, logger: Common.Logger): Common.MessageConnection;
export function createMessageConnection(inputStream: NodeJS.ReadableStream, outputStream: NodeJS.WritableStream, logger: Common.Logger): Common.MessageConnection;
export function createMessageConnection(input: Common.MessageReader | NodeJS.ReadableStream, output: Common.MessageWriter | NodeJS.WritableStream, logger: Common.Logger): Common.MessageConnection {
	let reader = isMessageReader(input) ? input : new StreamMessageReader(input);
	let writer = isMessageWriter(output) ? output : new StreamMessageWriter(output);
	return Common.createMessageConnection(reader, writer, logger);
}