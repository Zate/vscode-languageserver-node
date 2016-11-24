#!/bin/sh -x

IMAGE_NAME="vscode-languageserver-node_build_browser"

docker build -t $IMAGE_NAME .
docker run $IMAGE_NAME