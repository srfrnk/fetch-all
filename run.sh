#!/usr/bin/env bash

if [ -n "$(which node)" ]; then
    node="node"
else
    node="nodejs"
fi

"$node" $(dirname $(readlink -f $0))/fetch-all.js
