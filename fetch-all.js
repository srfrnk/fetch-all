#!/usr/bin/env nodejs

"use strict";

var exec = require('child_process').exec;
var pad = require('node-string-pad');
var async = require('async');

console.log('Fetching...');
exec("git fetch;git branch -lvv", function (error, stdout/*, stderr*/) {
    if (!!error) {
        console.log('exec error: ' + error);
    }

    var branches = stdout.split('\n').map(function (line) {
        var current = !!line.match(/^\s*\*\s*/);
        var local = line.match(/^\s*\*?\s*([\w\-]+)/);
        var remote = line.match(/\[([\w\-\/]+)(:.*)?\]/);
        return {
            current: current,
            local: !local ? null : local[1],
            remote: !remote ? null : remote[1]
        };
    }).filter(function (branch) {
        return !!branch.local && !!branch.remote;
    });

    var maxLocal = branches.reduce(function (max, branch) {
        return Math.max(max, branch.local.length);
    }, 0);

    var maxRemote = branches.reduce(function (max, branch) {
        return Math.max(max, branch.remote.length);
    }, 0);

    console.log("\n" + branches.map(function (branch) {
            return pad(branch.local, maxLocal) + ' <-- ' + pad(branch.remote, maxRemote);
        }).join('\n'));

    var current = branches.filter(function (branch) {
        return branch.current;
    })[0];

    console.log("\nCurrent branch: " + current.local + "\n");

    async.eachSeries(branches, function (branch, next) {
        console.log("Merging " + branch.local + "...");
        exec("git checkout " + branch.local + " ; " + "git merge " + branch.remote, function (error/*, stdout, stderr*/) {
            if (!!error) {
                console.log('exec error: ' + error);
            }
            next();
        });
    }, function () {
        exec("git checkout " + current.local, function (error/*, stdout, stderr*/) {
            if (!!error) {
                console.log('exec error: ' + error);
            }
            console.log("\nDone fetching all");
        });
    });
});
