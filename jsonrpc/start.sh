#!/bin/sh -x

# compile first
echo "compiling..."
tsc -p ./src

echo "server start..."
node lib/samples/server.js &
echo "client start..."
node lib/samples/client.js

# output
#
# + echo server start...
# server start...
# + echo client start...
# client start...
# + node lib/samples/client.js+ 
# node lib/samples/server.js
# server.ts - server bound
# client.ts - connected to server!
# server.ts - client connected
# server.ts - onNotification: Hello World
# ^C
