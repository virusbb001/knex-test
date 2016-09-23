/* eslint no-console: "off", no-unused-vars: "off" , no-debugger: "off" */
"use strict";

import "source-map-support/register";

import path from "path";

import Yargs from "yargs";
import colors from "colors/safe";
import yaml from "js-yaml";
import Knex from "knex";

import core from "./Core.js";
import Table from "./CLI/Tables.js";
import schema from "./CLI/Schema.js";

// import todo_cli from "./CLI/Todo.js";
import todo from "./apps/Todo";

let knex;
let root_mapping={};

function regist_mapping(module){
  root_mapping[module.command]=module;
}

function regist_commands(){
  var yargs = Yargs.
    usage("Usage: $0 <command> [options]").
    option("d",{
      alias: "database",
      describe: "sqlite's database path",
      type: "string",
      default: path.join(path.dirname(__filename),"..","./todo.sqlite3"),
      global: true
    }).
    strict().
    help();

  yargs=todo.cli.builder(yargs).
    command(schema);

  regist_mapping(todo.cli);
  regist_mapping(schema);
  return yargs;
}

/// メインルーティング
function exec(args){
  knex=Knex({
    client: "sqlite",
    connection: {
      filename: args.database
    },
    useNullAsDefault: true
  });

  if(args._[0] in root_mapping){
    var module=root_mapping[args._[0]];
    var self=new module.target_class(knex);
    return module.routing(args, self, root_mapping);
  }

  // default rooting
  return todo.cli.routing(args, new todo.cli.target_class(knex));
}

/// 最初に実行するやつ
function run(argv){
  var yargs=regist_commands();

  Promise.resolve(exec(yargs.argv)).
    then(()=> knex.destroy());
}

export default run;
