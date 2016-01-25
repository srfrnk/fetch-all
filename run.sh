#!/usr/bin/env bash
if [$(which nodejs) = ""]
then
    node="node"
else
    node="nodejs"
fi

$node $(dirname $(readlink -f $0))/fetch-all.js

