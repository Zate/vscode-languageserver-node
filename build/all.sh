#!/bin/sh

BUILD_FILES="find . -maxdepth 2 -mindepth 2 -type d -name node_modules -o -name lib"
echo "rm: node_modules/, lib/:" `$BUILD_FILES | wc -l`
($BUILD_FILES) | xargs rm -fr

( \
  cd types && \
  echo `pwd` && \
  npm unlink && \
  npm install --silent && \
  npm run compile && \
  npm link \
)

( \
  cd jsonrpc && \
  echo `pwd` && \
  npm unlink  && \
  npm link "vscode-languageserver-types" && \
  npm install --silent && \
  npm run compile && \
  npm link \
)

( \
  cd client && \
  echo `pwd` && \
  npm unlink && \
  npm link "vscode-jsonrpc" && \
  npm link "vscode-languageserver-types" && \
  npm install --silent && \
  npm run update-vscode && \
  npm run compile && \
  npm link \
)

# ( \
#   echo "########" && \
#   cd server && \
#   echo "`pwd`" && \
#   npm unlink  && \
#   npm link "vscode-jsonrpc" && \
#   npm link "vscode-languageserver-types" && \
#   npm install && \
#   npm run compile && \
#   npm link && \
#   echo "########" \
# )

# ( \
#   echo "########" && \
#   cd client.tests && \
#   echo "`pwd`" && \
#   npm unlink  && \
#   npm link "vscode-languageserver-types" && \
#   npm install && \
#   npm run compile && \
#   npm link && \
#   echo "########" \
# )

# ( \
#   echo "########" && \
#   echo "find: node_modules/, lib/:" && \
#   ($BUILD_FILES) && \
#   echo "########" \
# )