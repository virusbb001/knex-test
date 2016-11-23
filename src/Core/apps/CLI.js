/* eslint no-console: off */
let this_yargs;

import Model from "./Model";

const app_command={
  command: "apps",
  describe: "apps management",
  builder: (yargs)=>{
    this_yargs=yargs.
      command("list", "[alias: ls] list task").
      command("ls", false). // alias for list
      command("create <name...>", "create task").
      help();
    return this_yargs;
  },
  /**
   * routing function
   *
   * @param {string[]} args - arguments
   */
  routing: function(args, self){
    let routing_table={
      list: function(){
        console.log(
          self.apps().map(
            module => Object.keys(module)
          ).reduce( (a, b)=> a.concat(b)).join("\n")
        );
        return self.apps();
      },
      create: function(){
        throw new Error("Not Implemented yet");
      }
    };
    routing_table.ls = routing_table.list;

    let cmd = args._[ args._[0] === this.command ? 1 : 0];

    if(cmd in routing_table){
      return routing_table[cmd](args);
    }

    this_yargs.showHelp();
    return;
  },
  target_class: Model
};

export default app_command;
