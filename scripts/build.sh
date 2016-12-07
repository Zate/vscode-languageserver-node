#!/bin/sh

BUILD_FILES="find . -maxdepth 2 -mindepth 2 -type d -name node_modules -o -name lib"

echo "########"
echo "rm: node_modules/, lib/:" && ($BUILD_FILES)
($BUILD_FILES) | xargs rm -fr
echo "find: node_modules/, lib/:" && ($BUILD_FILES | wc -l)
echo "########"

( \
  echo "########" && \
  cd types && \
  echo "`pwd`" && \
  npm unlink  && \
  npm install && \
  npm run compile && \
  npm link && \
  echo "########" \
)

( \
  echo "########" && \
  cd jsonrpc && \
  echo "`pwd`" && \
  npm unlink  && \
  npm link "vscode-languageserver-types" && \
  npm install && \
  npm run compile && \
  npm link && \
  echo "########" \
)

( \
  echo "########" && \
  cd client && \
  echo "`pwd`" && \
  npm unlink  && \
  npm link "vscode-jsonrpc" && \
  npm link "vscode-languageserver-types" && \
  npm install && \
  npm run compile && \
  npm link && \
  echo "########" \
)

( \
  echo "########" && \
  cd server && \
  echo "`pwd`" && \
  npm unlink  && \
  npm link "vscode-jsonrpc" && \
  npm link "vscode-languageserver-types" && \
  npm install && \
  npm run compile && \
  npm link && \
  echo "########" \
)

( \
  echo "########" && \
  cd client.tests && \
  echo "`pwd`" && \
  npm unlink  && \
  npm link "vscode-languageserver-types" && \
  npm install && \
  npm run compile && \
  npm link && \
  echo "########" \
)

( \
  echo "########" && \
  echo "find: node_modules/, lib/:" && \
  ($BUILD_FILES) && \
  echo "########" \
)