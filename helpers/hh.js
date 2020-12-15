
module.exports = {

  stringify: function(object){
    return JSON.stringify(object)
  },
  ifeq: function(a, b, options){
    // console.log(a + ' = ' + b, a==b)
    console.log(a,b)
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
    return user.userType
  },
  returnName: function(user, options){
    return user.investor.name
  },
}