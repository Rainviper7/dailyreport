//----------import
// var data = require('./data_report').a;
var _ = require('lodash');
var pdf = require('pdfkit');
var fs = require('fs');
var dateFormat = require('dateformat');
var path = require('path');

//---------constant
    var ROW_DEFAULT = 50;
    var FONT_SIZE_HEADER = 14;
    var FONT_SIZE = 9.5;
    var FONT_SIZE_CATALOG = 10;
    var FONT_SIZE_SMALL = 8;
    var FONT_SIZE_BIG = 11;
    var PAGE_HEIGHT = 700;
    var TEXT_SPACE_LOWER = 5;
    var TEXT_SPACE = FONT_SIZE + TEXT_SPACE_LOWER;
    var ROW_CURRENT = ROW_DEFAULT;
    var hilight = false;
    var row_hilight = 0;
    var row_p1 = ROW_DEFAULT;
    var totalchartnewlinespace = FONT_SIZE_BIG + TEXT_SPACE_LOWER

    //----------table_layout
    var TAB_TABLE = {
        INDEX: 45,
        NAME: 65,
        QUANTITY: 335,
        AMOUNT: 405,
        PERCENT: 475,
        LAST: 545
    }

    var TAB_TABLE_CATALOG = {
        NAME: 45,
        QUANTITY: 335,
        AMOUNT: 405,
        PERCENT: 475,
        LAST: 545
    }

    var TAB_CATALOG = {
        NAME: TAB_TABLE_CATALOG.NAME + 5,
        QUANTITY: TAB_TABLE_CATALOG.QUANTITY + 5,
        AMOUNT: TAB_TABLE_CATALOG.AMOUNT + 5,
        PERCENT: TAB_TABLE_CATALOG.PERCENT + 5,
        LAST: TAB_TABLE_CATALOG.LAST - 5
    }

    var TAB_ITEMS = {
        INDEX: 50,
        NAME: 70,
        QUANTITY: 340,
        AMOUNT: 410,
        PERCENT: 480,
        LAST: 550
    }

    var TAB_TABLE_TOPPING_GROUP = {
        INDEX: 45,
        QUANTITY: 235,
        LAST: 305,
    }

    var TAB_TABLE_TOPPING = {
        INDEX: 45,
        NAME: 65,
        QUANTITY: 235,
        LAST: 305,
    }

    var TAB_TOPPING = {
        INDEX: TAB_TABLE_TOPPING_GROUP.INDEX + 5,
        NAME: 70,
        QUANTITY: TAB_TABLE_TOPPING_GROUP.QUANTITY + 5,
        LAST: TAB_TABLE_TOPPING_GROUP.LAST - 5,
    }

    var TAB_TABLE_EXPENSES_GROUP = {
        INDEX: 45,
        AMOUNT: 235,
        PERCENT: 305,
        LAST: 375
    }
        var TAB_TABLE_EXPENSES = {
        INDEX: 45,
        NAME: 65,
        AMOUNT: 235,
        PERCENT: 305,
        LAST: 375
    }

    var TAB_EXPENSES = {
        INDEX: TAB_TABLE_EXPENSES_GROUP.INDEX + 5,
        NAME: 70,
        AMOUNT: TAB_TABLE_EXPENSES_GROUP.AMOUNT + 5,
        PERCENT: TAB_TABLE_EXPENSES_GROUP.PERCENT + 5,
        LAST: TAB_TABLE_EXPENSES_GROUP.LAST - 5
    }

    var TAB_TABLE_CHART_TOTAL = {
        NAME: 45,
        LAST: 300
    }

    var TAB_CHART_TOTAL = {
        NAME: TAB_TABLE_CHART_TOTAL.NAME + 5,
        LAST: TAB_TABLE_CHART_TOTAL.LAST - 5
    }

    var TAB_TABLE_CHART_DETAIL = {
        NAME: 330,
        LAST: 545
    }
    var TAB_CHART_DETAIL = {
        NAME: TAB_TABLE_CHART_DETAIL.NAME + 5,
        LAST: TAB_TABLE_CHART_DETAIL.LAST - 5
    }

//----------main---
function Report(pathPdf, data) {
    var _path = pathPdf;
    var _data = data;

    var filename = _path;
    var data = _data;

    var dailyReport = new pdf;
    var now = new Date()
    var datetime = dateFormat(now, "dd mmmm yyyy, HH:MM:ss");
    var fontpath = path.join(__dirname,'fonts','ARIALUNI.ttf');
    var fontpath_bold = path.join(__dirname,'fonts','arialbd.ttf');
   
   dailyReport.registerFont('font_style_normal',fontpath,'')
   dailyReport.registerFont('font_style_bold',fontpath_bold,'')
    
        // dailyReport.font('font_style_bold')
        // dailyReport.font('font_style_normal')
    
    return {
        buildPdf: buildPdf
    }
    function buildPdf() {

        console.log("dailyReport module");
        console.log("- Start...");
        main();
        console.log("- Genearate Complete : "+filename);
    }

    //------------function
    function main() {
        dailyReport.pipe(fs.createWriteStream(filename));
        // dailyReport.font(fontpath);
        dailyReport.font('font_style_normal')
        //gridmarker(1700,800,100,2);
        drawHeader();
        drawBody();
        drawFooter();
        dailyReport.end();

    }
    function drawHeader() {

        dailyReport.fontSize(FONT_SIZE_HEADER)
            .text(data.ShopName, TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            });
        NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER);

        dailyReport.fontSize(FONT_SIZE_HEADER)
            .text("รายงานประจำวันที่ : " + dateFormat(data.From, "dd/mm/yyyy") + " " + dateFormat(data.From, "HH:MM") + " - " + dateFormat(data.To, "HH:MM"), TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .LAST - TAB_TABLE
                    .INDEX,
                align: 'left'
            });

        NewLine(TEXT_SPACE + 5);

        dailyReport.fontSize(FONT_SIZE_SMALL).fillColor('gray')
            .text("Genearated at : " + 
            datetime
            , TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            });

        dailyReport.fillColor('black');

        NewLine(FONT_SIZE_HEADER * 2 + TEXT_SPACE_LOWER);

        row_p1 = ROW_CURRENT;
        row_hilight = row_p1;
        hilight = true;

        //NewLine(TEXT_SPACE);
      if (hilight) {

            dailyReport.rect(TAB_TABLE_CHART_TOTAL.NAME, row_hilight - 5,(TAB_TABLE_CHART_TOTAL.LAST - TAB_TABLE_CHART_TOTAL.NAME), 101 + 15).fill('#ddd'); //fixcode

        dailyReport.fill('black');

        }

        addTotalchart();
        addDetailChart();


        //--------------

        row_hilight = 0;
        hilight = false;


        if (row_p1 > ROW_CURRENT) {
            ROW_CURRENT = row_p1;
        }
        NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER);

    }
    function drawBody() {

        dailyReport.fontSize(FONT_SIZE_HEADER)
            .text("Menu", TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            });
        NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER * 2);

        var CatalogFiltered = _.filter(data.Sales.Catalogs, function (c) {
            return c.Amount != 0 && c.Quantity != 0;
        });

        _.forEach(CatalogFiltered, function (e, i, l) {

            addTableLine(TAB_TABLE
                .INDEX, ROW_CURRENT, TAB_TABLE
                    .LAST, ROW_CURRENT); //row line

            addCatalog(e);

            _.forEach(TAB_TABLE_CATALOG, function (value, key) {
                addColumnLine(value);

            })

            NewLine(TEXT_SPACE);

            addTableLine(TAB_TABLE
                .INDEX, ROW_CURRENT, TAB_TABLE
                    .LAST, ROW_CURRENT); //row line

            checkPositionOutsideArea();

            var itemfillter = _.filter(e.Items, function (it) {
                return it.Amount != 0 && it.Quantity != 0;
            })

            _.forEach(itemfillter, function (item, key) {

                if (((key + 1) % 2) == 1) {
                    row_hilight = ROW_CURRENT;
                    hilight = true;

                }

                if (item.SubItems.length == 1) {
                    if (hilight) {
                        addHilight(row_hilight, TEXT_SPACE);
                    }
                    addItems(item, key);

                    _.forEach(TAB_TABLE
                        , function (value, key) {
                            addColumnLine(value);
                        })


                    row_hilight = 0;
                    hilight = false;


                    NewLine(TEXT_SPACE);
                    addTableLine(TAB_TABLE
                        .INDEX, ROW_CURRENT, TAB_TABLE
                            .LAST, ROW_CURRENT); //row line


                } else {
                    // if(hilight){
                    //                 addHilight(row_hilight,ROW_CURRENT-row_hilight);
                    //             }
                    row_hilight = ROW_CURRENT;

                    if (hilight) {
                        addHilight(row_hilight, TEXT_SPACE);
                    }
                    addItems(item, key);

                    _.forEach(TAB_TABLE
                        , function (value, key) {
                            addColumnLine(value);
                        })
                    NewLine(TEXT_SPACE);

                    var itemfillter = _.filter(item.SubItems, function (e1) {
                        return e1.Amount != 0 && e1.Quantity != 0;
                    })


                    _.forEach(itemfillter, function (subitem) {

                        if (hilight) {
                            addHilight(row_hilight + TEXT_SPACE, TEXT_SPACE);
                        }

                        addSubItems(subitem);

                        _.forEach(TAB_TABLE, function (value, key) {

                            addColumnLine(value);

                        })

                        NewLine(TEXT_SPACE);

                    });

                    addTableLine(TAB_TABLE
                        .INDEX, ROW_CURRENT, TAB_TABLE
                            .LAST, ROW_CURRENT); //row line

                    checkPositionOutsideArea()


                    row_hilight = 0;
                    hilight = false;
                }


            });

            NewLine(TEXT_SPACE);

        });

        dailyReport.fontSize(FONT_SIZE)
            .text("*ราคาในตารางหักส่วนลดสินค้าแล้ว", TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            });
        NewLine(FONT_SIZE + TEXT_SPACE_LOWER * 2);

        //-----topping----
        //NewLine(TEXT_SPACE);
        var ToppingGroupsFiltered = _.filter(data.Sales.ToppingGroups, function (c) {
            return c.Quantity != 0;
        });

        if(ToppingGroupsFiltered.length==0){

        }else{

        dailyReport.fontSize(FONT_SIZE_HEADER)
            .text("Topping Menu", TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            });
        NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER * 2);



        _.forEach(ToppingGroupsFiltered, function (expen1, key) {

            addTableLine(TAB_TABLE_TOPPING
                .INDEX, ROW_CURRENT, TAB_TABLE_TOPPING
                    .LAST, ROW_CURRENT); //row line

            addToppingGroups(expen1);


            _.forEach(TAB_TABLE_TOPPING_GROUP, function (value, key) {
                addColumnLine(value);
            })

            NewLine(TEXT_SPACE);

            addTableLine(TAB_TABLE_TOPPING
                .INDEX, ROW_CURRENT, TAB_TABLE_TOPPING
                    .LAST, ROW_CURRENT); //row line

            checkPositionOutsideArea();

            var ToppingItemsFiltered = _.filter(expen1.Toppings, function (c) {
                return c.Quantity != 0;
            });

            _.forEach(ToppingItemsFiltered, function (toppingitem, key) {

                if (((key + 1) % 2) == 1) {

                    addHilightTopping(ROW_CURRENT, TEXT_SPACE);

                }

                addToppingItems(toppingitem, key);



                _.forEach(TAB_TABLE_TOPPING
                    , function (value, key) {
                        addColumnLine(value);
                    })

                NewLine(TEXT_SPACE);

                addTableLine(TAB_TABLE_TOPPING
                    .INDEX, ROW_CURRENT, TAB_TABLE_TOPPING
                        .LAST, ROW_CURRENT); //row line

            });
            NewLine(TEXT_SPACE);
        });

        dailyReport.fontSize(FONT_SIZE)
            .text("*** Topping Menu แสดงเฉพาะรายการที่เคลือนไหว", TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            });
        NewLine(FONT_SIZE + TEXT_SPACE_LOWER * 2);
    }
        //-----------------

        //-----------DeletedMenu
        NewLine(TEXT_SPACE);


        var DeleteGroupsFiltered = _.filter(data.Sales.DeletedMenu, function (c) {
            return c.Amount != 0 && c.Quantity != 0;
        });
        if (DeleteGroupsFiltered.length == 0) {

        } else {
            dailyReport.fontSize(FONT_SIZE_HEADER)
                .text("Deleted Menu", TAB_TABLE
                    .INDEX, ROW_CURRENT, {
                    width: TAB_TABLE
                        .QUANTITY - TAB_TABLE
                        .INDEX,
                    align: 'left'
                });
            NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER * 2);



            _.forEach(DeleteGroupsFiltered, function (expen1, key) {

                addTableLine(TAB_TABLE
                    .INDEX, ROW_CURRENT, TAB_TABLE
                        .LAST, ROW_CURRENT); //row line

                addToppingGroups(expen1);


                _.forEach(TAB_CATALOG2, function (value, key) {
                    addColumnLine(value);
                })

                NewLine(TEXT_SPACE);

                addTableLine(TAB_TABLE
                    .INDEX, ROW_CURRENT, TAB_TABLE
                        .LAST, ROW_CURRENT); //row line

                checkPositionOutsideArea();

                var DeleteItemFiltered = _.filter(expen1.Toppings, function (c) {
                    return c.Amount != 0 && c.Quantity != 0;
                });

                _.forEach(DeleteItemFiltered, function (toppingitem, key) {

                    addItems(toppingitem, key);

                    if (((key + 1) % 2) == 1) {

                        addHilight(ROW_CURRENT, TEXT_SPACE);

                    }

                    _.forEach(TAB_TABLE
                        , function (value, key) {
                            addColumnLine(value);
                        })

                    NewLine(TEXT_SPACE);

                    addTableLine(TAB_TABLE
                        .INDEX, ROW_CURRENT, TAB_TABLE
                            .LAST, ROW_CURRENT); //row line

                });
                NewLine(TEXT_SPACE);
            });

            dailyReport.fontSize(FONT_SIZE)
                .text("*** Deleted Menu แสดงเฉพาะรายการที่เคลือนไหว", TAB_TABLE
                    .INDEX, ROW_CURRENT, {
                    width: TAB_TABLE
                        .QUANTITY - TAB_TABLE
                        .INDEX,
                    align: 'left'
                });
            NewLine(FONT_SIZE + TEXT_SPACE_LOWER * 2);
        }
        //--------------Expenses
        var ExpensesGroupFiltered = _.filter(data.Expenses, function (c) {
            return c.Amount != 0;
        });

        
     if (ExpensesGroupFiltered.length == 0) {

        }
        else {

            NewLine(TEXT_SPACE);

            dailyReport.fontSize(FONT_SIZE_HEADER)
                .text("Expenses", TAB_TABLE
                    .INDEX, ROW_CURRENT, {
                    width: TAB_TABLE
                        .QUANTITY - TAB_TABLE
                        .INDEX,
                    align: 'left'
                })
                .text("-฿ "+ numberWithCommas(data.Expense), TAB_TABLE 
                    .INDEX, ROW_CURRENT, {
                    width: TAB_TABLE
                        .LAST - TAB_TABLE
                        .INDEX,
                    align: 'right'
                });
            NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER * 2);



            var ExpensesGroupFiltered = data.Expenses; //--fixcode

            _.forEach(ExpensesGroupFiltered, function (expen1, key) {

                addTableLine(TAB_TABLE_EXPENSES_GROUP
                    .INDEX, ROW_CURRENT, TAB_TABLE_EXPENSES_GROUP
                        .LAST, ROW_CURRENT); //row line

                addExpensesGroups(expen1);


                _.forEach(TAB_TABLE_EXPENSES_GROUP, function (value, key) {
                    addColumnLine(value);
                })

                NewLine(TEXT_SPACE);

                addTableLine(TAB_TABLE_EXPENSES_GROUP
                    .INDEX, ROW_CURRENT, TAB_TABLE_EXPENSES_GROUP
                        .LAST, ROW_CURRENT); //row line

                checkPositionOutsideArea();

                var ExpensesItemFiltered = _.filter(expen1.Items, function (c) {
                    return c.Amount != 0 && c.Quantity != 0;
                });

                _.forEach(ExpensesItemFiltered, function (toppingitem, key) {

                   if (((key + 1) % 2) == 1) {

                        addHilightExpence(ROW_CURRENT, TEXT_SPACE);

                    }
                    addExpensesItems(toppingitem, key);

                    

                    _.forEach(TAB_TABLE_EXPENSES
                        , function (value, key) {
                            addColumnLine(value);
                        })

                    NewLine(TEXT_SPACE);

                    addTableLine(TAB_TABLE_EXPENSES
                        .INDEX, ROW_CURRENT, TAB_TABLE_EXPENSES
                            .LAST, ROW_CURRENT); //row line

                });
                NewLine(TEXT_SPACE);
            });

            dailyReport.fontSize(FONT_SIZE)
                .text("*** Expenses แสดงเฉพาะรายการที่เคลือนไหว", TAB_TABLE
                    .INDEX, ROW_CURRENT, {
                    width: TAB_TABLE
                        .QUANTITY - TAB_TABLE
                        .INDEX,
                    align: 'left'
                });
            NewLine(FONT_SIZE + TEXT_SPACE_LOWER * 2);
//--------------
 NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER * 2);
        dailyReport.fontSize(FONT_SIZE_HEADER)
            .text("ยอดสุทธิ", TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            })

 var footerGrandtotal = data.GrandTotal //--fixcode
 footerGrandtotal = data.GrandTotal-data.Expense //--fixcode

            dailyReport.text("฿ " + numberWithCommas2(footerGrandtotal), TAB_TABLE
                .AMOUNT, ROW_CURRENT, {
                width: TAB_TABLE
                    .LAST - TAB_TABLE
                    .AMOUNT,
                align: 'right'
            });

        NewLine(FONT_SIZE_HEADER + TEXT_SPACE_LOWER * 2);

//---------------

        }

    }
    function drawFooter() {

       

        addTableLine(TAB_TABLE
            .INDEX, ROW_CURRENT, TAB_TABLE
                .LAST, ROW_CURRENT); //row line
        addTableLine(TAB_TABLE
            .INDEX, ROW_CURRENT + 3, TAB_TABLE
                .LAST, ROW_CURRENT + 3); //row line
        //----------------------
        NewLine(FONT_SIZE_SMALL);
        dailyReport.fontSize(FONT_SIZE_SMALL).fillColor('gray')
            .text("Genearated at : " +datetime, TAB_TABLE
                .INDEX, ROW_CURRENT, {
                width: TAB_TABLE
                    .QUANTITY - TAB_TABLE
                    .INDEX,
                align: 'left'
            });

        dailyReport.fillColor('black');


    }
    function addTotalchart() {

        row_p1 += TEXT_SPACE_LOWER;



        dailyReport.fontSize(FONT_SIZE_BIG)
            .text("Total :",
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'left'
            })

            .text("฿ " + numberWithCommas(data.Income),
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'right'
            });
        row_p1 += totalchartnewlinespace;

        addDashLine(TAB_CHART_TOTAL
            .NAME, row_p1 - 2, TAB_CHART_TOTAL
                .LAST, row_p1 - 2); //dash line

        dailyReport.fontSize(FONT_SIZE_BIG)
            .text("Item Discount :",
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'left'
            })

            .text("-฿ " + numberWithCommas(data.ItemDiscount),
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'right'
            });
        row_p1 += totalchartnewlinespace;

        addDashLine(TAB_CHART_TOTAL
            .NAME, row_p1 - 2, TAB_CHART_TOTAL
                .LAST, row_p1 - 2); //dash line

        dailyReport.fontSize(FONT_SIZE_BIG)
            .text("Service Charge :",
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'left'
            })

            .text("฿ " + numberWithCommas(data.ServiceCharge),
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'right'
            });

        row_p1 += totalchartnewlinespace;

        addDashLine(TAB_CHART_TOTAL
            .NAME, row_p1 - 2, TAB_CHART_TOTAL
                .LAST, row_p1 - 2); //dash line

        dailyReport.fontSize(FONT_SIZE_BIG)
            .text("Additional Discount: ",
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'left'
            })

            .text("-฿ " + numberWithCommas(data.Discount),
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'right'
            });

        row_p1 += totalchartnewlinespace;

        addDashLine(TAB_CHART_TOTAL
            .NAME, row_p1 - 2, TAB_CHART_TOTAL
                .LAST, row_p1 - 2); //dash line

        dailyReport.fontSize(FONT_SIZE_BIG)
            .text("Vat : ",
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'left'
            })

            .text("-฿ " + numberWithCommas(data.Vat),
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'right'
            });

        row_p1 += totalchartnewlinespace;

        addTableLine(TAB_CHART_TOTAL
            .NAME, row_p1, TAB_CHART_TOTAL
                .LAST, row_p1); //row line
        //------------------

        dailyReport.fontSize(FONT_SIZE_BIG)
            .text("Grand Total : ",
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'left'
            })



            dailyReport.text("฿ " + numberWithCommas(data.GrandTotal),
            TAB_CHART_TOTAL
                .NAME, row_p1, {
                width: TAB_CHART_TOTAL
                    .LAST - TAB_CHART_TOTAL
                    .NAME,
                align: 'right'
            });

        row_p1 += totalchartnewlinespace;

        addTableLine(TAB_CHART_TOTAL
            .NAME, row_p1, TAB_CHART_TOTAL
                .LAST, row_p1); //row line
        //------------------


    }
    function addCatalog(itemgroup) {

        
        dailyReport.fontSize(FONT_SIZE_CATALOG)
            .text('', TAB_CATALOG, ROW_CURRENT)
            .text('Qty', TAB_CATALOG.QUANTITY, ROW_CURRENT)
            .text('Total', TAB_CATALOG.AMOUNT, ROW_CURRENT)
            .text('Percent', TAB_CATALOG.PERCENT, ROW_CURRENT, {
                width: TAB_TABLE.LAST - (TAB_TABLE.PERCENT + 10), align: 'right'
            });

        _.forEach(TAB_TABLE_CATALOG, function (value, key) {
            addColumnLine(value);

        })
       
        NewLine(TEXT_SPACE);


        dailyReport.fontSize(FONT_SIZE_CATALOG)
            .text(itemgroup.Name, TAB_CATALOG.NAME, ROW_CURRENT)
            .text(itemgroup.Quantity, TAB_CATALOG.QUANTITY, ROW_CURRENT)
            .text("฿ " + numberWithCommas(itemgroup.Amount), TAB_CATALOG.AMOUNT, ROW_CURRENT)
            .text(itemgroup.Percent + "%", TAB_CATALOG.PERCENT, ROW_CURRENT, {
                width: TAB_TABLE.LAST - (TAB_TABLE.PERCENT + 10), align: 'right'
            });

    }

    function addItems(item, key) {
        dailyReport.fontSize(FONT_SIZE)
            .text(key + 1 + '.', TAB_ITEMS.INDEX, ROW_CURRENT)
            .text(item.Name, TAB_ITEMS.NAME, ROW_CURRENT)
            .text(item.Quantity, TAB_ITEMS.QUANTITY, ROW_CURRENT)
            .text("฿ " + numberWithCommas(item.Amount), TAB_ITEMS.AMOUNT, ROW_CURRENT)
            .text(item.Percent + "%", TAB_ITEMS.PERCENT, ROW_CURRENT, {
                width: TAB_TABLE.LAST - (TAB_TABLE.PERCENT + 10), align: 'right'
            });
            
    }

    function addSubItems(subitem) {
        dailyReport.fontSize(FONT_SIZE)
            .text("        " + subitem.Name, TAB_ITEMS.NAME, ROW_CURRENT)
            .text("        " + subitem.Quantity, TAB_ITEMS.QUANTITY, ROW_CURRENT)
            .text("        " + "฿ " + subitem.Amount, TAB_ITEMS.AMOUNT, ROW_CURRENT)

    }

    function addToppingGroups(toppinggroup) {

        dailyReport.fontSize(FONT_SIZE)
            .text(toppinggroup.Name, TAB_TOPPING.INDEX, ROW_CURRENT)
            .text("Qty", TAB_TOPPING.QUANTITY, ROW_CURRENT)
    }

    function addToppingItems(item, key) {
        dailyReport.fontSize(FONT_SIZE)
            .text(key + 1 + '.', TAB_TOPPING.INDEX, ROW_CURRENT)
            .text(item.Name, TAB_TOPPING.NAME, ROW_CURRENT)
            .text(item.Quantity, TAB_TOPPING.QUANTITY, ROW_CURRENT);

    }

    function addExpensesGroups(Expensesgroup) {

        dailyReport.fontSize(FONT_SIZE)
            .text('', TAB_EXPENSES.INDEX, ROW_CURRENT)
            .text("Amount", TAB_EXPENSES.AMOUNT, ROW_CURRENT)
            .text("Percent", TAB_EXPENSES.PERCENT, ROW_CURRENT, {
                width: TAB_EXPENSES.LAST - TAB_EXPENSES.PERCENT,
                align: 'right'
            }
            );

                    _.forEach(TAB_TABLE_EXPENSES_GROUP, function (value, key) {
            addColumnLine(value);

        })

        NewLine(TEXT_SPACE);

                dailyReport.fontSize(FONT_SIZE)
            .text(Expensesgroup.Name, TAB_EXPENSES.INDEX, ROW_CURRENT)
            .text("฿ " + numberWithCommas(Expensesgroup.Amount), TAB_EXPENSES.AMOUNT, ROW_CURRENT)
            .text((Expensesgroup.Percent*100).toFixed(2)+'%', TAB_EXPENSES.PERCENT, ROW_CURRENT, {
                width: TAB_EXPENSES.LAST - TAB_EXPENSES.PERCENT,
                align: 'right'
            }
            );


    }

    function addExpensesItems(item, key) {
        dailyReport.fontSize(FONT_SIZE)
            .text(key + 1 + '.', TAB_EXPENSES.INDEX, ROW_CURRENT)
            .text(item.Name, TAB_EXPENSES.NAME, ROW_CURRENT)
            .text("฿ " + numberWithCommas(item.Amount), TAB_EXPENSES.AMOUNT, ROW_CURRENT)
            .text((item.Percent*100).toFixed(2)+'%', TAB_EXPENSES.PERCENT, ROW_CURRENT, {
                width: TAB_EXPENSES.LAST - TAB_EXPENSES.PERCENT,
                align: 'right'
            }
            );

    }

    function checkPositionOutsideArea() {

        if (ROW_CURRENT > PAGE_HEIGHT) {
            dailyReport.addPage();
            ROW_CURRENT = ROW_DEFAULT;
            if (hilight == true) {
                row_hilight = ROW_DEFAULT;
            }
        }


    }

    function addTableLine(sx, sy, ex, ey) {
        dailyReport.moveTo(sx, sy).lineTo(ex, ey).stroke();
    }

    function addDashLine(sx, sy, ex, ey) {
        dailyReport.moveTo(sx, sy).lineTo(ex, ey).lineWidth(0.8).dash(5, { space: 5 }).strokeColor('gray').strokeOpacity(0.2).stroke().undash();
        dailyReport.strokeColor('black').strokeOpacity(1).lineWidth(1)
    }

    function NewLine(px) {
        ROW_CURRENT += px;
        checkPositionOutsideArea()

    }

    function addColumnLine(tab) {
        addTableLine(tab, ROW_CURRENT, tab, ROW_CURRENT + TEXT_SPACE);
    }

    function NewPage() {
        dailyReport.addPage({
            margins: 10,
            top: 10, bottom: 10, left: 50, right: 50
        });
        ROW_CURRENT = ROW_DEFAULT;
    }

    function addHilight(position, row_height) {

        dailyReport.rect(TAB_TABLE
            .INDEX, position, (TAB_TABLE
                .LAST - TAB_TABLE
                    .INDEX), row_height).fill('#ddd');

        dailyReport.fill('black');
    }

    function addHilightTopping(position, row_height) {
        //         dailyReport.highlight(TAB_TABLE_TOPPING
        // .INDEX,position,(TAB_TABLE_TOPPING.LAST-TAB_TABLE_TOPPING.INDEX),row_height, {color : '#ddd'});

        dailyReport.rect(TAB_TABLE_TOPPING
            .INDEX, position, (TAB_TABLE_TOPPING.LAST - TAB_TABLE_TOPPING.INDEX), row_height).fill('#ddd');

        dailyReport.fill('black');
    }
    
        function addHilightExpence(position, row_height) {

        dailyReport.rect(TAB_TABLE_EXPENSES
            .INDEX, position, (TAB_TABLE_EXPENSES.LAST - TAB_TABLE_EXPENSES.INDEX), row_height).fill('#ddd');

        dailyReport.fill('black');
    }

    function addDetailChart() {


        dailyReport.fontSize(FONT_SIZE_SMALL)
            .text("Bills : " + data.BillCount + "        Avg per bill : " + numberWithCommas(data.Income / data.BillCount),
            TAB_CHART_DETAIL
                .NAME, ROW_CURRENT, {
                width: TAB_CHART_DETAIL
                    .LAST - TAB_CHART_DETAIL
                    .NAME,
                align: 'left'
            });

        NewLine(FONT_SIZE_SMALL + TEXT_SPACE_LOWER);



        dailyReport.fontSize(FONT_SIZE_SMALL)
            .text("Shift :",
            TAB_CHART_DETAIL
                .NAME, ROW_CURRENT, {
                width: TAB_CHART_DETAIL
                    .LAST - TAB_CHART_DETAIL
                    .NAME,
                align: 'left'
            });
        NewLine(FONT_SIZE_SMALL + TEXT_SPACE_LOWER);

        _.forEach(data.ShiftSummary, function (e, i, l) {
            dailyReport.fontSize(FONT_SIZE_SMALL)
                .text("               " + e.Name + "        " + "฿ " + numberWithCommas(e.Amount) + " (" + e.Quantity + ")",
                TAB_CHART_DETAIL
                    .NAME, ROW_CURRENT, {
                    width: TAB_CHART_DETAIL
                        .LAST - TAB_CHART_DETAIL
                        .NAME,
                    align: 'left'
                });
            NewLine(FONT_SIZE_SMALL + TEXT_SPACE_LOWER);
        })

        dailyReport.fontSize(FONT_SIZE_SMALL)
            .text("PaymentType :",
            TAB_CHART_DETAIL
                .NAME, ROW_CURRENT, {
                width: TAB_CHART_DETAIL
                    .LAST - TAB_CHART_DETAIL
                    .NAME,
                align: 'left'
            });
        NewLine(FONT_SIZE_SMALL + TEXT_SPACE_LOWER);

        _.forEach(data.PaymentTypeSummary, function (e1, i1, l1) {

            dailyReport.fontSize(FONT_SIZE_SMALL)
                .text("               " + e1.Name + "      ฿ " + numberWithCommas(e1.Amount) + " (" + e1.Quantity + ")",
                TAB_CHART_DETAIL
                    .NAME, ROW_CURRENT, {
                    width: TAB_CHART_DETAIL
                        .LAST - TAB_CHART_DETAIL
                        .NAME,
                    align: 'left'
                });
            NewLine(FONT_SIZE_SMALL + TEXT_SPACE_LOWER);


        })

        _.forEach(data.VoidBills, function (e, i, l) {

            dailyReport.fontSize(FONT_SIZE_SMALL)
                .text("Void Bills : " + l.length + "        Amount : " + "฿ " + numberWithCommas(e.GrandTotal),
                TAB_CHART_DETAIL
                    .NAME, ROW_CURRENT, {
                    width: TAB_CHART_DETAIL
                        .LAST - TAB_CHART_DETAIL
                        .NAME,
                    align: 'left'
                });

            NewLine(FONT_SIZE_SMALL + TEXT_SPACE_LOWER);
        });
    }


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

//--fixcode
    function numberWithCommas2(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


}

module.exports = Report;





