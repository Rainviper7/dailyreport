var data = require('./data_report').a;
var generatePdf = require('./index');
var dateFormat = require('dateformat');

var datetime = dateFormat(now, "ddmmmmyyyy_HHMMss");
var filename = 'daily_report_'+data.ShopName+'_'+dateFormat(now, "ddmmmmyyyy_HHMMss")+'.pdf';
var now = new Date();

var aa = new generatePdf(filename,data);
    
   aa.buildPdf();