#!/bin/sh -x

#  clone repo
git clone git@github.com:Synthace/vscode-languageserver-node.git

cd vscode-languageserver-node

# build jsonrpc module
# then link to it
cd jsonrpc
npm install
npm link

# build the client now
cd ../client
npm link vscode-jsonrpc
/Users/mbana/work/repos/Synthace/antha-editor/vsco de-languageserver-node/client/node_modules/vscode-jsonrpc -> /usr/local/lib/node_modules/vscode-jsonrpc -> /Users/mbana/work/repos/Synthace/antha-editor/vscode-languageserver-node/jsonrpc
npm install
