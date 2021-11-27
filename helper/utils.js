 function address(value) {
     if (value == null) return '';

     let val = value.substring(0, 40) + '..';

     return val.replace(/(?:_| |\b)(\w)/g, function ($1) {
         return $1.replace('_', ' ');
     });
 }
 module.exports = {
     address
 }