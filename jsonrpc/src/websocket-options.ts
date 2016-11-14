export interface WebSocketOptions {
	// possibly provide an option to spawn
	// the languageserver in websocket mode

	// cwd?: string;
	// env?: any;
	// encoding?: string;
	// execArgv?: string[];

	secure?: boolean,
	host?: string;
	port?: string;
	namespace?: string;
	path?: string;
}
