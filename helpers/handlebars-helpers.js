const moment = require('moment');
const {OrderStatus,reasonType,
       paymentType,OrderStatusCode,
       OrderStatusColor,Notifyto,
       deliverychargeoptions,
       rategivenornot,
       OrderStatusForRestaurant,
       OrderStatusForAdmin,
       Timezonelist,
     } = require('./../services/functions.service');
const messages = require('../cores/messages').messages;
const {Credentials} = require('./../cores/credentials');
var helpers = require('handlebars-helpers')();
// const { forEach }     = require('p-iteration');

module.exports = {
  googlekey: function(){
    return Credentials.googlemap.mapkey;
  },
  stringify: function(object){
    return JSON.stringify(object)
  },
  toJson: function(object){
    var string = JSON.stringify(object)
    console.log(string)
    var parsed = JSON.parse(string)
    console.log(parsed)
    console.log(typeof(parsed))
    return JSON.parse(string)
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
  checkDelete:function(status,options){

    if([OrderStatusCode.completed,OrderStatusCode.cancel_by_restaurant,OrderStatusCode.cancel_by_admin].includes(status.toString())){
      return options.fn(this);
    }

    return options.inverse(this);

  },
  checkEdit:function(status,options){

    if([OrderStatusCode.requested,OrderStatusCode.accepted,OrderStatusCode.on_the_way].includes(status.toString())){
      return options.fn(this);
    }

    return options.inverse(this);

  },
  checkstatusformap:function(status,options){

    if([OrderStatusCode.requested,OrderStatusCode.delivered,OrderStatusCode.completed,OrderStatusCode.cancel_by_admin,OrderStatusCode.cancel_by_restaurant].includes(status.toString())){
      return options.inverse(this);
    }
    return options.fn(this);
    

  },
  checkStatus:function(status,options){

    if([OrderStatusCode.requested].includes(status.toString())){
      return options.inverse(this);
    }

    return options.fn(this);

  },
  checkStatusWithHelp:function(status,is_help,options){
      
    if([OrderStatusCode.requested].includes(status.toString()) || ![OrderStatusCode.requested].includes(status.toString()) && is_help){
      return options.inverse(this);
    }

    return options.fn(this);

  },

  checkStatusForReassigningPanel:function(status, options){
    
    if("1234567".includes(status)){
      // return options.fn(this);
    return options.inverse(this);
      // return true
    }
    // return false
      return options.fn(this);
    // return options.inverse(this);

  },

  checkcompletedStatus:function(status,options){

    if([OrderStatusCode.completed].includes(status.toString())){
      return options.fn(this);
    }
    return options.inverse(this);
  },
  checkStatusforcancelpopup:function(status,options){

    if([OrderStatusCode.requested,OrderStatusCode.accepted].includes(status.toString())){
      return options.fn(this);
    }

    return options.inverse(this);
  },
  checkcancelbutton:function(status,options){

    if([OrderStatusCode.delivered,OrderStatusCode.completed,OrderStatusCode.cancel_by_admin,OrderStatusCode.cancel_by_restaurant].includes(status.toString())){
      return options.inverse(this);
    }
    return options.fn(this);

  },

  recursiveformap:function(status,options){

    if([OrderStatusCode.requested,OrderStatusCode.delivered,OrderStatusCode.completed,OrderStatusCode.cancel_by_admin,OrderStatusCode.cancel_by_restaurant].includes(status.toString())){
        return false;  
    }
    return true;
    

  },
  
  checkvalue:function(arr,value,orderid){
    var status = 0;
    for(var i=0; i<arr.length; i++){
      var value;
      var name = arr[i];
      if(name == value){
        status = 1;
        break;
      }
    }
    // if(status == 1)
    //   return '<a class="dropdown-item" href="/admin/deliveries/edit/'+orderid+'"><i class="zmdi zmdi-edit zmdi-hc-fw text-secondary"></i> Edit</a>';
    return status;

  
  },
  currentId: function(url) {
    return url.split('?')[1].split('=')[1];
  },
  substring: function(str,limit) {
    return str.substr(0,limit);
  },
  splitstring: function(str) {
    if(str != null){
    var string= str.split(",");
    var mid="";
    for (var i = 0; i < string.length; i++) {
        mid = mid==""?string[i]:(mid + " | " +  string[i]);
        if(i==2){
           mid +='...';
           break;
        }
    }
    return mid;
  }
	},
  formatTime: function (date) {
    var mmnt = moment(date);

    var today = moment(new Date());

    var format
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format=messages['date_formate'];
    }
  
    return mmnt.format(format);
  },
  formatdateTime: function (date) {
    var mmnt = moment(date);
    var today = moment(new Date());
    
    var format
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format=messages['datetime_formate'];
    }
    return mmnt.format(format);
  },
  cmsformatDate: function (date) {
    var mmnt = moment(date);

    var today = moment(new Date());
    
    var format
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format=messages['cms_date_formate'];
    }
  
    return mmnt.format(format);
	},
  formatDateAndTime: function (date) {
    var mmnt = moment(date);

    var today = moment(new Date());
    
    var format
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format='lll';
    }

    return mmnt.format('lll'); // Jan 24, 2019 11:39 AM
  },
  userType: function(a){
    let types = {C:'Contractor',U:'Merchant',D:'Driver'};
    if( types[a] != undefined ) {
        return types[a];
    }else return 'Users';
  },
  image: function(a){
    if( a != undefined && a != '' && a != null) {
        return a;
    }else return '/images/no-image.png';
  },
  getObjectCount:function objectLength(obj){
        var result = 0;

      for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
        // or Object.prototype.hasOwnProperty.call(obj, prop)
          result++;
        }
      }
      return result;
    },
  getDriversCount:function objectLength(obj){
        var result = 0;

      for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
        // or Object.prototype.hasOwnProperty.call(obj, prop)
          result++;
        }
      }
      return result;
    },
  eachProperty: function(context, options) {
    var ret = "";
    for(var prop in context)
    {
        ret = ret + options.fn({property:prop,value:context[prop]});         
    }
    return ret;
  },
  debug:function(model){
      console.log('\x1b[36m%s\x1b[0m','***********model**************');
      console.log(model);
      console.log('\x1b[36m%s\x1b[0m','***********model**************');   
  },
  uppercase:function(str){
      let array1 = str.split('_');
      let newarray1 = [];
        
      for(let x = 0; x < array1.length; x++){
          newarray1.push(array1[x].charAt(0).toUpperCase()+array1[x].slice(1));
      }
      return newarray1.join(' ');
    },
  assignContractor:function(contractor,driver,options){

      if(contractor == null)
        return options.fn(this);
      else 
       return options.inverse(this);
  },
  ongoing: function(a, b, options){
    if (a == b) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  past: function(a, options){
    if (a == 'C' || a == 'CO') {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  inversePast: function(a, options){
    if (a == 'C' || a == 'CO') {
    return options.inverse(this);
      }
      return options.fn(this);
  },
  nullChecker: function(a, options){
    if (a == null) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  nullCheckerInverse: function(a, options){
    if (a != null) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  assignDriver:function(contractor,driver,options){

      if(contractor != undefined && contractor != null &&  driver == null)
        return options.fn(this);
      else 
       return options.inverse(this);
  },
  upcommingCheck: function(contractor,driver,status, options){
    if (contractor == null &&  driver == null && status == 'I') {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  driverCount:function(data){
    return data.get('driverCount');
  },
  Sum:function(v1,v2){
    return v1+v2;
  },
  Multiply:function(v1,v2){
    return Math.ceil(v1*v2);
  },
  contractorEarning:function(data,id,options){
    let amount = data.find(obj => obj.contractor_id == id);

    if(amount != undefined)
      return  amount.amount;
    else return 0;
  },
  isExists: function(role_id,role_ids,options){
      

      function inArray(target, array){
        for(var i = 0; i < array.length; i++) 
        {
          if(array[i] == target)
          {
            return true;
          }
        }

        return false; 
      }

    const roles =  role_ids.auth_item.split(',');

    if(inArray(role_id, roles) === true){
        console.log(role_id);
      return options.fn(this);
    }

    return options.inverse(this);
  },

ifCond:function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
  },

  checkAuth:function(user,roles,route,options){
    // console.log(route)
    if(user.user_type == 1 || user.user_type == 3)
        return  options.fn(this);      

    if(roles.includes(route))
        return  options.fn(this);

    return options.inverse(this);
  },
  checkNotiAuth:function(user,path,route,options){

      if(user.user_type == 1 || user.user_type == 3)
        return  options.fn(this);  

      console.log('\x1b[36m%s\x1b[0m','********path*******route**********');
      console.log(path,route,route.includes(path));
      console.log('\x1b[36m%s\x1b[0m','*******path*********route*********');
      
    if(route.includes(path))
      return  options.fn(this);

    return options.inverse(this);
  },
  orderStatus:function(status){

    if(OrderStatusForRestaurant['en'][status] != undefined)
        return OrderStatusForRestaurant['en'][status];
    return 'Unknown';

  },
  orderadminStatus:function(status){

    if(OrderStatusForAdmin['en'][status] != undefined)
        return OrderStatusForAdmin['en'][status];
    return 'Unknown';

  },
  reasonType:function(type){

    if(reasonType[type] != undefined)
        return reasonType[type];
    return 'Unknown';

  },
  paymentType:function(type){
    // console.log(paymentType)
    if(paymentType[type] != undefined)
        return paymentType[type];
    return 'Unknown';

  },
  JsonParse:function(json, options){
    options.data.root['object'] = JSON.parse(json);
  },
  Rating:function(rating){

      let maxRating=5;
      let along=false;

      let fullStar = "<i class = 'fa fa-star'></i>";
      let halfStar = "<i class = 'fa fa-star-half-full'></i>";
      let emptyStar = "<i class = 'fa fa-star-o'></i>";
      rating = rating <= maxRating ? rating: maxRating;

      fullStarCount = Math.floor(rating);
      halfStarCount = Math.ceil(rating)-fullStarCount;
      emptyStarCount = maxRating -fullStarCount-halfStarCount;

      let html =  fullStar.repeat(fullStarCount);
      html += halfStar.repeat(halfStarCount);
      html += emptyStar.repeat(emptyStarCount);

      if(along)
        html = html;
      else
        html = '<ul>'+html+'</ul>';
      return html;
  },
  orderStatusSquareColor:function(status){

    if (OrderStatus['en'][status] != undefined)
          return `<td class="order_status"><span class="badge text-light" style="background-color:${OrderStatusColor[status]};">${OrderStatusForRestaurant['en'][status]}</span></td>`;
    return `<td><span class="badge text-light" style="background-color:${OrderStatusColor[status]};">Unknown</span></td>`;
  },
  orderStatusSquareColorforadmin:function(status,data= null){
    // console.log(status)
    if (OrderStatus['en'][status] != undefined){
        if (status == OrderStatusCode.requested){
          if(!data)
            return `<td class="order_status"><span class="badge text-light" style="background-color:${OrderStatusColor[status]};">Unassigned</span></td>`;
          else 
            return `<td class="order_status"><span class="badge text-light" style="background-color:${OrderStatusColor[status]};">${OrderStatusForAdmin['en'][status]}</span></td>`
        }
        else
          return `<td class="order_status"><span class="badge text-light" style="background-color:${OrderStatusColor[status]};">${OrderStatusForAdmin['en'][status]}</span></td>`;
    }
    return `<td><span class="badge text-light" style="background-color:${OrderStatusColor[status]};">Unknown</span></td>`;
  },
  orderStatusButtonColorforadmin:function(status,data=null){

     if (status == OrderStatusCode.requested){
         if(!data)
            return `<span class="badge text-light  font-size-14" style="padding: 1px 6px 2px !important; line-height: 23px !important; background-color:${OrderStatusColor[status]};">Unassigned</span></span>`;
         else 
          return `<span class="badge text-light  font-size-14" style="padding: 1px 6px 2px !important; line-height: 23px !important; background-color:${OrderStatusColor[status]};">${OrderStatusForAdmin['en'][status]}</span></span>`;
     }
    return `<span class="badge text-light font-size-14" style="padding: 1px 6px 2px !important; line-height: 23px !important; background-color:${OrderStatusColor[status]};">${OrderStatusForAdmin['en'][status]}</span></span>`;
  },
  orderStatusButtonColor:function(status){

    if (OrderStatus['en'][status] != undefined)
          return `<span class="badge text-light  font-size-14" style="padding: 1px 6px 2px !important; line-height: 23px !important; background-color:${OrderStatusColor[status]};">${OrderStatusForRestaurant['en'][status]}</span></span>`;
    return `<span class="badge text-light font-size-14" style="padding: 1px 6px 2px !important; line-height: 23px !important; background-color:${OrderStatusColor[status]};">Unknown</span></span>`;
  },
  orderStatusRoundColor:function(status){

    if (OrderStatus['en'][status] != undefined)
          return `<td class="order_status"><span class="badge" style="background-color:${OrderStatusColor[status]};">${OrderStatusForRestaurant['en'][status]}</span></td>`;
    return `<td><span class="badge" style="background-color:${OrderStatusColor[status]};">Unknown</span></td>`;
  },
  getnotifytotext:function(type){
    return Notifyto[type];
  },
  lat:function(){
    return 37.0902;
  },
  lng:function(){
    return 95.7129;
  },
  Deliverychargeoptions:function(options){

    if(deliverychargeoptions[options] != undefined)
        return deliverychargeoptions[options];
    return 'Unknown';

  },
  Getongoingordercountbyriderid: async function(riderid){
    let count=0;
    count = await getongoingordercountbyriderid(riderid);
    console.log(count);
    if(count > 0)
      return '<a href="/admin/riders/location/'+riderid+'"><i class="zmdi zmdi-my-location zmdi-hc-fw"></i></a>';
  },
  leadingzero :function pad(num, size=5) {
      var s = "00000" + num;
      return s.substr(s.length-size);
  },
  getObjectCountforrider:function objectLength(obj,id){
    var result = 0;

  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
    // or Object.prototype.hasOwnProperty.call(obj, prop)
      result++;
    }
  }
  if(result > 0)
    return '<a href="/admin/riders/location/'+id+'"><i class="zmdi zmdi-my-location zmdi-hc-fw"></i></a>';
  
  },

  getObjectCountfordeleterider:function objectLength(obj,id){
    var result = 0;

  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
    // or Object.prototype.hasOwnProperty.call(obj, prop)
      result++;
    }
  }
  if(result == 0)
    return '<a class="dropdown-item"href="javascript:void(0)" id="delete-status" data-slug-id="'+id+'"><i class="zmdi zmdi-delete zmdi-hc-fw text-secondary"></i> Delete</a>';
  
  },
  Getratebutton: async function(order_id,rider_id){
    let count=0;
    count = await rategivenornot(order_id,rider_id);
    // console.log(count);
    if(count > 0)
      return '<a href="javascript:void(0);" class="btn btn-primary btn-sm rating-popup">Rating to Rider</a>';
  },
  ETDFormater: function(time){
   return Math.floor(time / 60)+'h ' +Math.ceil(time % 60) +'m';
  },

  formatTimewithtimezone: function (date,timezone) {
    var mmnt = moment(date);
     var today = moment(new Date());
    
    var format
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format=messages['date_formate'];
    }
      
    // console.log('\x1b[36m%s\x1b[0m','**********date,timezone***************');
    // console.log(date,timezone);
    // console.log('\x1b[36m%s\x1b[0m','***********date,timezone**************');
      
    return mmnt.tz(timezone).format(format);
  },
  formatdateTimewithtimezone: function (date,timezone) {
    var format
    var mmnt = moment(date);
    var today = moment(new Date());
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format=messages['datetime_formate'];
    }
    return mmnt.tz(timezone).format(format);
  },



  formatOnlyDateWithTimezone: function (date,timezone) {
    var mmnt = moment(date);
     var today = moment(new Date());
    
    var format

    format=messages['date_formate'];

      
    // console.log('\x1b[36m%s\x1b[0m','**********date,timezone***************');
    // console.log(date,timezone);
    // console.log('\x1b[36m%s\x1b[0m','***********date,timezone**************');
      
    return mmnt.tz(timezone).format(format);
  },


  formatOnlyTimeWithTimezone: function (date,timezone) {
    var mmnt = moment(date);
     var today = moment(new Date());
    
    var format
    format=messages['time_format'];

      
    // console.log('\x1b[36m%s\x1b[0m','**********date,timezone***************');
    // console.log(date,timezone);
    // console.log('\x1b[36m%s\x1b[0m','***********date,timezone**************');
      
    return mmnt.tz(timezone).format(format);
  },
  cmsformatDatewithtimezone: function (date,timezone) {
    var mmnt = moment(date);
    var today = moment(new Date());
    
    var format
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format=messages['cms_date_formate'];
    }
    return mmnt.tz(timezone).format(format);
  },
  dateDiff: function (laterDate,earlierDate) {
    if (!laterDate || !earlierDate){
      return ''
    }
    var later = moment(new Date(laterDate));
    var early = moment(new Date(earlierDate));

    return Math.abs(early.diff(later, 'minutes'));
  },
  formatDateAndTimewithtimezone: function (date,timezone) {
    var mmnt = moment(date);
    var today = moment(new Date());
    
    var format
    if (today.isSame(mmnt, 'd')){
      format=messages['time_format'];
    }
    else{
      format='lll';
    }
    return mmnt.tz(timezone).format(format); // Jan 24, 2019 11:39 AM
  },
  totalSum:function (objcet){
      
     let totalEarning = 0;
        objcet.forEach(data=>{
              totalEarning += data.amount;
      });
    return totalEarning;
  },

  totalRemaining:function (objcet){
      
     let totalEarning = 0;
        objcet.forEach(data=>{
              totalEarning += data.paid;
      });
    return totalEarning;
  },
  remaining:function (earning,paid){
      
     let totalEarning = 0;
     let totalPaid = 0;
      earning.forEach(data=>{
              totalEarning += data.amount;
      });

      paid.forEach(data=>{
              totalPaid += data.paid;
      });

    return totalEarning - totalPaid;
  },
  checkPay:function(earning,remaining,options){

    let totalEarning = 0;
    let totalPaid = 0;
    
    earning.forEach(data=>{
              totalEarning += data.amount;
      });

    remaining.forEach(data=>{
              totalPaid += data.paid;
      });

    if(totalEarning)
      return options.fn(this);

    // if (totalEarning - totalPaid == 0)
      // return options.fn(this);

    else
      return options.inverse(this);
  },
  arrival_time:function(status,timezone){

    if(status && status.status_date){
          var mmnt = moment(status.status_date);
          var today = moment(new Date());
          
          var format

          format=messages['time_format'];

         return `<td class="arrival_time">${mmnt.tz(timezone).format(format)}</td>`;
    }
    else return `<td class="arrival_time"></td>`;
  },
  assigned_time:function(status,timezone){
    // console.log(status)
    if(status && status.status_date){
          var mmnt = moment(status.status_date);
          var today = moment(new Date());
          
          var format
          format=messages['time_format'];

         return `<td class="assigned_time">${mmnt.tz(timezone).format(format)}</td>`;
    }
    else return `<td class="assigned_time"></td>`;
  },
  pick_up_time:function(status,timezone){

    if(status && status.status_date){
         var mmnt = moment(status.status_date);
          var today = moment(new Date());

          var format
          format=messages['time_format'];
          


         return `<td class="pick_up_time">${mmnt.tz(timezone).format(format)}</td>`;
    }
    else return `<td class="pick_up_time"></td>`;
  },
  reach_time:function(status,timezone){

    if(status && status.status_date){
         var mmnt = moment(status.status_date);
          var today = moment(new Date());
          
          var format
          format=messages['time_format'];
          

         return `<td class="reach_time">${mmnt.tz(timezone).format(format)}</td>`;
    }
    else return `<td class="reach_time"></td>`;
  },
  delivered_time:function(status,timezone){
    
    if(status && status.status_date){
         var mmnt = moment(status.status_date);
          var today = moment(new Date());

          var format
          format=messages['time_format'];
          

         return `<td class="delivered_time">${mmnt.tz(timezone).format(format)}</td>`;
    }
    else return `<td class="delivered_time"></td>`;
  },
  getMonth:function(m){
     
    switch(m){
      case 1:  return "for January";break;
      case 2:  return "for February";break;
      case 3:  return "for March";break;
      case 4:  return "for April";break;
      case 5:  return "for May";break;
      case 6:  return "for June";break;
      case 7:  return "for July";break;
      case 8:  return "for August";break;
      case 9:  return "for September";break;
      case 10: return "for October";break;
      case 11: return "for November";break;
      case 12: return "for December";break;
      default: return "";
    }
  },
}
