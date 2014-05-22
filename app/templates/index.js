var bwLabs = require("bw_labs");
var http = require("http");
var path = require("path");
var host = process.env.HOST || "localhost";
var port = process.env.PORT || 3000;

var options = {
 projectDirectory: __dirname,
 applyDbMigrations: (process.argv.filter(function(arg){return arg == "--db-migrate";}).length > 0)
};

bwLabs.server.start(options)(function(err, r){
  if(err){
    console.error(err.message || err);
    process.exit(1);
    return;
  }
  if(options.applyDbMigrations){
    process.exit(0);
    return;
  }
  console.log("Listening %s:%d (%s)", host, port, r[1].env);
});

