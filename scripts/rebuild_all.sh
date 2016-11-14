#!/bin/sh -x

echo "rebuilding libs"
(cd types && npm install && npm link)
(cd jsonrpc && npm install && npm link)
(cd client && npm install && npm link)


