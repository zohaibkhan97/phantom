
module.exports = {

  stringify: function(object){
    return JSON.stringify(object)
  },
  ifeq: function(a, b, options){
    // console.log(a + ' = ' + b, a==b)
    if (a == b) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  ifneq: function(a, b, options){
    // console.log(a,b,a!=b);
    if (a != b) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  returnType: function(user, options){
    if (user){return user.userType}
    else{return}
  },
  returnName: function(user, options){
    if (user){return user.name}
    else{return}
  },
  returnId: function(user, options){
    if (user){return user.id}
    else{return}
  },
}