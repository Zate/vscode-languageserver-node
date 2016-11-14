#!/bin/sh -x

# #  clone repo
# git clone git@github.com:Synthace/vscode-languageserver-node.git

# cd vscode-languageserver-node

# building just the jsonrcp module for now
cd jsonrpc
npm install

# build the client module
cd ../client
npm install -f -S ../jsonrpc
npm install -f -S ../types
