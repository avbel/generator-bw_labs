"use strict";
module.exports = function*(app){
  return app.Controller.extend({
    actions: {
      //TODO: add actions
      <% if(name=='__root'){%>index: function*(){
        this.body = <%= (viewsEnabled)?"yield this.render(\"index\")":"\"\"" %>;
      }<% } %>
    }
  });
};

