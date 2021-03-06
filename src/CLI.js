/* eslint no-console: "off", no-unused-vars: "error" , no-debugger: "off" */
"use strict";

import "source-map-support/register";

import path from "path";

import Yargs from "yargs";
import Knex from "knex";

import core_app from "./Core/apps";

import apps, {default_key} from "./apps";

let knex;
let root_mapping={};

// add first command
function regist_mapping(module){
  root_mapping[module.command]=module;
}

function regist_commands(){
  var yargs = Yargs.
    usage("Usage: $0 <command> [options]").
    option("d", {
      alias: "database",
      describe: "sqlite's database path",
      type: "string",
      default: path.join(path.dirname(__filename), "..", "./todo.sqlite3"),
      global: true
    }).
    strict().
    help();

  for(var app in apps){
    regist_mapping(apps[app].cli);
  }

  regist_mapping(core_app.cli);

  var def_cli = apps[default_key].cli;
  yargs=def_cli.builder(yargs).command(core_app.cli);
  return Object.keys(apps).filter(v => v!=default_key).
    reduce(function(yargs, key){
      return yargs.command(apps[key].cli);
    }, yargs);
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
  return apps[default_key].cli.routing(
    args, new apps[default_key].cli.target_class(knex)
  );
}

/// 最初に実行するやつ
function run(){
  var yargs=regist_commands();

  Promise.resolve(exec(yargs.argv)).
    then(()=> knex.destroy());
}

export default run;
