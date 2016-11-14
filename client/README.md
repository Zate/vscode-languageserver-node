**tl;dr;** Make sure you do the below otherwise the `jsonrpc` client will not be the locally built one:

```sh
$ git clone git@github.com:Synthace/vscode-languageserver-node.git
$ cd vscode-languageserver-node
$ cd jsonrpc
$ npm install
$ npm link
$ cd ../client

$ npm link vscode-jsonrpc
/Users/mbana/work/repos/Synthace/antha-editor/vsco de-languageserver-node/client/node_modules/vscode-jsonrpc -> /usr/local/lib/node_modules/vscode-jsonrpc -> /Users/mbana/work/repos/Synthace/antha-editor/vscode-languageserver-node/jsonrpc
$ npm install

> vscode-languageclient@3.0.0-alpha.3 prepublish /Users/mbana/work/repos/Synthace/antha-editor/vscode-languageserver-node/client
> node ./node_modules/vscode/bin/install && tsc -p ./src

Detected VS Code engine version: ^1.6.0
Found minimal version that qualifies engine range: 1.6.0
Fetching vscode.d.ts from: https://raw.githubusercontent.com/Microsoft/vscode/1.6.0/src/vs/vscode.d.ts
vscode.d.ts successfully installed!
```

# VSCode Language Server - Client Module

[![NPM Version](https://img.shields.io/npm/v/vscode-languageclient.svg)](https://npmjs.org/package/vscode-languageclient)
[![NPM Downloads](https://img.shields.io/npm/dm/vscode-languageclient.svg)](https://npmjs.org/package/vscode-languageclient)
[![Build Status](https://travis-ci.org/Microsoft/vscode-languageserver-node.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-languageserver-node)

This npm module allows VSCode extensions to easily integrate langauge servers adhering to the [language server protocol](https://github.com/Microsoft/vscode-languageserver-protocol)

See [here](https://code.visualstudio.com/docs/extensions/example-language-server) for a detailed documentation on how to 
implement language servers for [VSCode](https://code.visualstudio.com/).

## History

For the history please see the [main repository](https://github.com/Microsoft/vscode-languageserver-node/blob/master/README.md)

## License
[MIT](https://github.com/Microsoft/vscode-languageserver-node/blob/master/License.txt)