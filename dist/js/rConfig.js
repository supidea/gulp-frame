var requirejs = {
  urlArgs: "bust=" +  (new Date()).getTime(),
  paths: {
    "jquery": "https://cdn.bootcss.com/jquery/3.2.1/jquery.min",
    "bootstrap": "../lib/bootstrap.min"  //这里是相对入口文件的路径，比如home.js
  },
  shim: {
    "bootstrap": {
      deps: ["jquery"],
      exports : 'bootstrap'
    }
  }
};