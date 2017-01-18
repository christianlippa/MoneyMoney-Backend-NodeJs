﻿// Details about how big this chart will be
var color = d3.scale.category10(); // Soon, make a range of green colours and red colours
var width = 500;
var height = 500;
var radius = Math.min(width, height) / 2; // not used just yet

/////////////
var clientId = "epRgjVF15vGKLJEL8EjVGV241IImwDW2";
var domain = 'moneymoney.auth0.com';
//var lock = new Auth0Lock(clientId, domain);

var incomeCats = {
    "Paycheque": "Pay Cheque",
    "OSAP": "OSAP",
    "bursary": "Bursary",
    "Allowance": "Allowance",
    "Loan": "Loan",
    "One Time": "One Time"
};

var expenseCats = {
    "payback":"Pay Back Loan",
    "rent" : "Rent",
    "living": "Living Expense",
    "food": "Food",
    "clothing": "Clothing",
    "entertainment": "Entertainment",
    "transportation": "Transportation"
};

////////////////////////////////        PIE NATION              ////////////////
function makePie() {
    //clear the div
    $("#chart").empty();

    //////This example is not sorted by date so lets do that
    var datar = getData();

    datar = datar.sort(sortByDateAscending);

    var pie = d3.layout.pie()
        .value(function (d) { return d.amount; });

    var slices = pie(datar);

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(100);

    // helper that returns a color based on an ID THANK GOD this exists

    var svg = d3.select('#chart').append('svg').attr('width', width)
        .attr('height', height);

    //where it is on the map
    var g = svg.append('g').attr('transform', 'translate(200, 250)');

    g.selectAll('path.slice')
        .data(slices)
        .enter()
        .append('path')
        .attr('class', 'slice')
        .attr('d', arc)
        .attr('fill', function (d) {
            return color(d.data.type);
        });

    svg.append('g')
        .attr('class', 'legend')
        .selectAll('text')
        .data(slices)
        .enter()
        .append('text')
        .text(function (d) { return '• ' + d.data.type; })
        .attr('fill', function (d) { return color(d.data.type); })
        .attr('y', function (d, i) { return 20 * (i + 1); });
}


///////////////// Lets make sticks and things               ///////////////////////
function makeBar() {
    //clear the div
    $("#chart").empty();
    // Get the data and work with it
    var data = getData();
    data = handleData(data);
    data = convertDate(data);
    //////////////          Lets draw out the SVG
    var margin = { top: 10, right: 20, bottom: 70, left: 40 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    //define axis
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(20);

    ///svg element
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom+50)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // / Create a tool tip
    var div = d3.select("body").append("tip")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // x's and y's!
    x.domain(data.map(function (data) { return data.date; }));
    //height of y's max
    y.domain([0, (d3.max(data, (function (data) { return data.amount; })))+100]);

    //this adds an axies
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    //work on y
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Amount");

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (data) { return x(data.date); })
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("fill", "red");
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<span style='font-weight:bold; font-size:2em; color:#ffffff; background-color:#000000'> Description: "+d.desc
                + " Amount: " + d.amount+  "</span>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mousemove", function(){
            return div.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(d, i) {
            d3.select(this).attr("fill", function() {
                return "" + color(this.id) + "";
            });
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (data) { return y(data.amount); })
        .attr("height", function (data) { return height - y(data.amount); });
}

///////////////////////We need some kind of circles chart too?         //////////////
function bubbleChart() {
    /// Still in the works
    $("#chart").empty();
    var datar = getData();
    datar = datar.sort(sortByDateAscending);

    var svg = d3.select("#chart").append("svg");
    svg.selectAll("circle").data(datar.id).enter()
        .append("circle")
        .attr("cx", function (datar) { return x(datar.amount); })
        .attr("cy", function (datar) { return y(datar.amount); })//function (p) { return y(p.amount);
        .attr("r", function (datar) { return y(datar.amount); })

        .style("fill", function (datar) { return y(datar.type); })
        .style("opacity", function (datar) { return y(datar.desc); })

        .append("Test")
        .text("testing");
}
////////////////////////////////ABOVE IS ALL CHARTS///////////////////

////////////////////////////////BELOW IS TESTING AND MANIPULATING THE DATASET///////////
/*                        User Specific                             */
/*                      User Specific grabData      */
function getData() {
    ///////////// Example for expense object
    var token = localStorage.getItem('userId');
    var returnThis = [];
    userObject = {
        "user_id":token,
    };
    $.ajax({
        type: "POST",
        async: false,
        url: "https://moneymoney.zapto.org/user/getData",
        // url:"/Capstone2/data/expenses.json",
        contentType: "application/json",
        dataType:"json",
        data: JSON.stringify(userObject),
        success: function (data) {
            returnThis = data;
        },
        error: function () {
            alert("Sorry, there was an error please refresh the page");
        }
    });
    returnThis = removeNan(returnThis);
    return returnThis;
};

function removeNan(data){
    var removeindex;
    for (var i = 0; i < data.length; i++){
        if (isNaN(data[i].amount)) {
            data.splice(i, 1);
        }
        try {
            data[i].amount = parseFloat(data[i].amount.replace("[$,]",""));
        } catch (err){
            console.log(err);
        }
    }
    return data;
};
/*                  User Specific Posting Transaction       */
function followTheMoney() {
    ///////////// Example for expense object
    //  var categoryString = $('#category input:radio:checked').val();

    var errormsg = "Please select the following: ";
    var flag =0;


    var typeString = $('#trantype input:radio:checked').val();

    if ($('#trantype input:radio:checked').val() != null) {
        var typeString = $('#trantype input:radio:checked').val();
    } else {
        errormsg = errormsg + " income or expense ";
        flag = 1;
    }
    if ( $('#category input:radio:checked').val() != "") {
        switch ($('#trantype input:radio:checked').val()){
            case "expense":
                var categoryString = $('#expenseList input:radio:checked').val();
                break;
            case "income":
                var categoryString = $('#incomeList input:radio:checked').val();
                break;
        }
    } else {
        errormsg = errormsg + " category";
        flag = 1;
    }
    if (document.getElementById('amount').value != null) {
        if(!isNaN(document.getElementById('amount').value)){
            var amountString = document.getElementById('amount').value;
        } else{
            flag = 1;
            errormsg = errormsg + " a proper number ";
        }
    } else {
        flag = 1;
        errormsg = errormsg + " an amount ";
    }
    if (document.getElementById('description').value != ""){
        var descString = document.getElementById('description').value;
    } else{
        flag = 1;
        errormsg = errormsg + " a description";
    }
    var date = new Date();
    var expenseObject = [];
    var token = localStorage.getItem('userId');
    if (flag == 0 ) {
    expenseObject = {
        "user_id":token,
        "type": typeString,
        "amount": amountString,
        "desc": descString,
        "category": categoryString,
        "date": date
    };
    $.ajax({
        type: "POST",
        async: false,
        url: "https://moneymoney.zapto.org/user/insertData",
        // url:"/Capstone2/data/expenses.json",
        contentType: "application/json",
        data: JSON.stringify(expenseObject),
        success: function () {
            alert("Successfully posted");
        },
        error: function () {
            alert("Sorry, there was an error please try again");
        }
    });
    } else{
        alert(errormsg);
    }
    data = getData();
    showBalance(data);
}
/*                  End of User Specific                        */
/*
 Grab and return data
 */
/*											OLD 					*/
function getDataOld() {
    var returnThis = [];
    $.ajax({
        type: "GET",
        async: false,
        url: "/Capstone2/data/expenses.json",
        // url: "http://moneymoney.zapto.org:8080",
        // data: "",
        dataType: "json",
        success: function (data) {
            returnThis = data;
        },
        error: function (err) {
        }
    });
    return returnThis;
}
/*
 Below is a transaction
 */
function followTheMoneyOld() {

    var errormsg = "Please select the following: ";
    var flag =0;
    if ( $('#category input:radio:checked').val() != "") {
        var categoryString = $('#category input:radio:checked').val();
    } else {
        errormsg = errormsg + " category";
        flag = 1;
    }
    if ($('#trantype input:radio:checked').val() != null) {
        var typeString = $('#trantype input:radio:checked').val();
    } else {
        errormsg = errormsg + " income or expense ";
        flag = 1;
    }
    if (document.getElementById('amount').value != null) {

        if(!isNaN(document.getElementById('amount').value)){
            var amountString = document.getElementById('amount').value;
        } else{
            flag = 1;
            errormsg = errormsg + " a proper number ";
        }
    } else {
        flag = 1;
        errormsg = errormsg + " an amount ";
    }
    if (document.getElementById('description').value != ""){
        var descString = document.getElementById('description').value;
    } else{
        flag = 1;
        errormsg = errormsg + " a description";
    }
    var date = new Date();
    var expenseObject = [];
    var token = localStorage.getItem('userId');

    if (flag == 0){
        expenseObject = {
            "type": typeString,
            "amount": amountString,
            "desc": descString,
            "category": categoryString,
            "date": date
        };

        $.ajax({
            type: "POST",
            async: false,
            url: "http://moneymoney.zapto.org:8080/insert",
            // url:"/Capstone2/data/expenses.json",
            contentType: "application/json",
            data: JSON.stringify(expenseObject),
            success: function () {
                alert("Successfully posted");
            },
            error: function () {
                alert("Sorry, there was an error please try again");
            }


        });
    } else {
        alert(errormsg);
    }

//showBalance();
}

/*
 This section will be all about the data
 -> Getting the data
 -> Filters for the data
 -> Apply the filters to the data
 */
//// Select only these dates
function transactionsXDaysOld(age, data) {
    var cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - age);
    data = data.filter(function (d) {
        return new Date(d.date) > cutoffDate;
    });
    return data;
}
//////Sort dates
function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return (new Date(a.date)) - (new Date(b.date));
}
//Sort by key
function sortType(data) {
    data.sort(function (a, b) {
        var keyA = a.type.toLowerCase(), keyB = b.type.toLowerCase();
        if (keyA < keyB) //sort string ascending
            return -1;
        if (keyA > keyB)
            return 1;
        return 0; //default return value (no sorting)
    })
};
//this returns amounts larger than a value
function transactionsLargerThan(amount) {
    return data => data.amount >= amount;
}
//this returns amounts less than a value
function transactionsSmallerThan(amount) {
    return data => data.amount <= amount;
}
function selectCat(data, a) {
    var tempData = [];
    $.each(a, function (key,val) {
        tempData =    tempData.concat(data.filter(x=>x.category === val));
    });
    return tempData;
}
function selectType(data, a) {
    var tempData = [];
    $.each(a, function (key,val) {
        tempData =    tempData.concat(data.filter(x=>x.type === val));
    });
    return tempData;
}
function convertDate(data){
    $.each(data, function(key, val){
        var newDate = new Date(val['date']);
        newDate = newDate.getDay() + "/" +newDate.getMonth() +"/"+newDate.getFullYear();
        val['date'] = newDate;
        data= data.sort(sortByDateAscending);

    });
    return data;
};
function makeDefaultBar(){
    // okay in here we want to create default values fo the make bargraph

}
function handleData(data) {
    var categories = [];
    var types = [];
    var duration;
    /*              Type income or expense or both          */
    if ($("input:checkbox[name='incomeCB']").is(":checked")) {
        types.push($("input:checkbox[name='incomeCB']").val());
        $("input:checkbox[name='incomeCBList']:checked").each(function () {
            var cat = $(this).val();
            categories.push(cat);
        });
    };
    if ($("input:checkbox[name='expenseCB']").is(":checked")) {
        types.push($("input:checkbox[name='expenseCB']").val());
        $("input:checkbox[name='incomeCBList']:checked").each(function () {
            var cat = $(this).val();
            categories.push(cat);
        });
    };
    /*                  Check boxes for Categories                      */
    /*                  Duration                        */
    duration = ($("input:radio[name='months']:checked").val());
    duration = duration * 30; // lets not worry about specific months just yet
    if (types.length > 0) {
        var newData = selectType(data, types);
    }
    if (categories.length > 0) {
        newData = selectCat(newData, categories);
    }
    if (duration > 0) {
        newData = transactionsXDaysOld(duration, newData);
    }
    return (newData);
}
///
///         Below will be html listeners and how to manipulate the dom
///
/*
 Load the navbar
 */

/*
 Run on certain pages run these scripts asap
 */
$(function () {
    //Do this for all pages
    /// Nav and footer
    $('#navbar').load('/nav/navframe.html');
    $('.footer').load('/nav/footer.html');
    /// Background


    /// End of all pages loading now lets get specific
    if ($('body').is('.graphs')) {

        $("#graphSelectorContainer").hide();
        $("#transContainer").click(function () {
            $("#transactionContainer").show();
            $("#graphSelectorContainer").hide();
        });
        $("#graphContainer").click(function () {
            $("#transactionContainer").hide();
            $("#graphSelectorContainer").show();
        });
        /* Load the category and buttons */
        var i = 0;
        $.each(expenseCats, function (key, value) {
            if (i = 0) {
                $("#expenseList .expenseRad").append(" <div class='col-lg-4'>"
                    + "<label class='btn btn-primary active'> "
                    + "<input type='radio' name='category'"
                    + "value='" + key + "'autocomplete='off' checked>" + value
                    + " </label></div>");
            } else {
                $("#category").append(" <div class='col-lg-4'>"
                    + "<label class='btn btn-primary'> "
                    + "<input type='radio' name='category'"
                    + "value='" + key + "'autocomplete='off' checked='true'>" + value
                    + " </label></div>");
            }

            i = i + 1;
        });
        var i = 0;
        $.each(incomeCats, function (key, value) {
            if (i = 0) {
                $("#incomeList .incomeRads").append(" <div class='col-lg-4'>"
                    + "<label class='btn btn-primary active'> "
                    + "<input type='radio' name='category'"
                    + "value='" + key + "'autocomplete='off'>" + value
                    + " </label></div>");
            } else {
                $("#incomeList .incomeRads").append(" <div class='col-lg-4'>"
                    + "<label class='btn btn-primary'> "
                    + "<input type='radio' name='category'"
                    + "value='" + key + "'autocomplete='off'>" + value
                    + " </label></div>");
            }
            i = i + 1;
        });
        $.each(incomeCats, function (value, key) {
            $("#graphSelectorContainer .incomeCbs").append(
                " <label class='btn btn-info btn-sm'> "
                + "<input name='incomeCBList' id='" + value + "Cb' value='" + value + "' type='checkbox' disabled /> " + key
                + "</label>"
            )
        });
        $.each(expenseCats, function (value, key) {
            $("#graphSelectorContainer .expenseCbs").append(
                " <label class='btn btn-info btn-sm'> "
                + "  <input name='expenseCBList' id='" + value + "Cb' type='checkbox' disabled /> " + key
                + "</label>"
            )
        });


        /* This handles the user profile and balance */
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            if (localStorage.getItem("ValidUser")) {
                // showBalance();
            } else {
                // probably invalid user
                //  $('body').empty();
                //   $('body').innerHtml = "Please log in";
            }
        } else {
        }
        data = getData();
        showBalance(data);
        makeBar(data);
    }
    /*                 Login Page              */
    if ($('body').is('.root')) {
        console.log("shitfuckpiss");
        var btn_login = document.getElementById("login");
        btn_login.addEventListener("click", lock.show());
        /*
         *
         *   This contains all Auth0Lock code
         *
         */
        var lock = new Auth0Lock(clientId, domain, {
            auth: {
                redirectUrl: 'http://localhost:63343/userprofile/graphs.html',
                responseType: 'token',
                params: {
                    scope: 'openid email' // Learn about scopes: https://auth0.com/docs/scopes
                }
            }
        });
// Listening for the authenticated event
        lock.on("authenticated", function (authResult) {
            console.log("shitfuckinlockonauth");
            // Use the token in authResult to getProfile() and save it to localStorage
            lock.getProfile(authResult.idToken, function (error, profile) {
                if (error) {
                    // Handle error
                    return;
                }
                console.log("authresult");
                console.log(authResult.idToken);
                localStorage.setItem('idToken', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
            });
        });
        var init = function () {
            var id_token = localStorage.getItem('idtoken');
            if (id_token) {
                // Old but lets keep it
            } else {
                //   Old but lets keep it
            }
        };
        init();
    }
    if ($('body').is('.contact')) {
        $('.shirin').load('/individual/Shirin.html');
        $('.rob').load('/individual/Rob.html');
        $('.christian').load('/individual/Christian.html');
    }
    if ($('body').is('.profile')) {
        var data = getData();
        suggestRent(data);
        showBalance(data);

        var collection = collectTypeCategory(data);
        var newcolor;
        var action;
        var listvalue;
        sortType(collection);
        $.each(collection, function (key, value) {
            if (value.type == 'income') {
                newcolor = "green";
                action = ["gained", "from"];
                listvalue = "#incomeList";
            }
            if (value.type == 'expense') {
                newcolor = "red";
                action = ["spent", "on"];
                listvalue = "#spentList";
            }
            $(listvalue).append(
                "<li> You have <span style=\"color:"+newcolor +"\" ; >" + action[0] + " $" + parseFloat(value.amount).toFixed(2)
                + " </span> " + action[1] + " " + value.category
                + "</li>");
        });

    }

    if (localStorage.getItem('userId') == null){
        console.log("null");
        $('#login').show();
        $('#logout').hide();
    } else {
        console.log("null hide lout");
        $('#login').toggle();
        $('.logout').toggle();
    }
});

/*
 Shows the balance of the account on the graphs page
 */
function showBalance(data) {
    //var data = [];
    //data = getData();
    var balance = 0; // start at 0
    for (var i = 0; i < data.length; i++) {
        if (data[i].type === "income") {
            balance += parseFloat(data[i].amount);
        } else if (data[i].type === "expense") {
            balance -= parseFloat(data[i].amount);
        }
    }
    //// Set the text and adjust the css
    $("#totalBalance").html(balance.toFixed(2) + " So if we are up to date this is what your bank account should currently look like!");
    if (balance > 0) {
        $("#totalBalanceContainer").toggleClass("alert-danger", false);
        $("#totalBalanceContainer").toggleClass("alert-success", true);
    } else if (balance < 0) {
        $("#totalBalanceContainer").toggleClass("alert-danger", true);
        $("#totalBalanceContainer").toggleClass("alert-success", false);
    }
}
/* This area is for analysing the data
 * */
function getTotalIncome(data) {
    // var data = getData();
    var totalIncome = 0; // start at 0
    for (var i = 0; i < data.length; i++) {
        if (data[i].type === "income") {
            totalIncome += parseFloat(data[i].amount);
        }
    }
    return totalIncome;
}

function collectTypeCategory(data){
    var collection = [];
    var skip;
    $.each(data, function(key, value) {
        skip = true;
        if (collection.length == 0) {
            collection.push({
                type: value.type,
                category: value['category'],
                amount: value.amount
            });
        }
        $.each(collection, function (colKey, colValue) {
            if (value.category == colValue.category) {
                try {
                    // wait on this one
                    colValue.amount = parseFloat(colValue['amount']) + parseFloat((value['amount'].replace("[$,]","")));
                }catch (err){
                    console.log("Oh no we got an error");
                    colValue.amount = parseFloat(colValue['amount']) + parseFloat((value['amount']));
                }
                colValue.counter = colValue.counter + 1;
                skip = false;
                return false;
            }
        });
        if (skip) {
            collection.push({
                'type': value.type,
                'category': value.category,
                'amount': value.amount,
                'counter' : 1
            });
        }
    });
    return collection;
}

function suggestRent(data){
    var data = collectTypeCategory(data);
    var totalIncome = getTotalIncome(data);
    var comment;
    var color;
    $.each(data, function(key, value){
        switch(value.category.toLowerCase()) {
            case "rent":
                if (value.amount < (.30 * totalIncome)) {
                    comment = "Good job, your rent is below 30% of your income, this will help maximize your savings";
                    color= "green";
                } else {
                    comment = "You are paying more than the suggested 30% of income on your rent. You may want to consider relocating while also keeping the distance to your work/school at a minimum";
                    color="red";
                }

                $("#rent").append("<p><span style=\"color:"+color +"\" ; >" + comment + "</span></p>");
                break;
            case "entertainment":
                if (value.amount < (.10 * (totalIncome/12))) {
                    comment = "Good job you are below 10% on average monthly entertainment expense";
                    color= "green";
                } else {
                    comment = "You are paying more than the suggested 15% of income on your food. You may want to consider using frozen or canned, buying on sale, using coupons, avoid shopping when you are hungry, choosing store or value brand. ";
                    color="red";
                }
                $("#entertainment").append("<p><span style=\"color:"+color +"\" ; >" + comment + "</span></p>");

                break;
            case "food":
                if (value.amount < (.14 * (totalIncome/12))) {
                    comment = "Good job you are below 15% on average monthly food expense";
                    color= "green";
                } else {
                    color="red";
                    comment = "You are paying more than the suggested 15% of income on your food. You may want to consider using frozen or canned, buying on sale, using coupons, avoid shopping when you are hungry, choosing store or value brand. ";
                }
                $("#food").append("<p><span style=\"color:"+color +"\" ; >" + comment + "</span></p>");
                break;
            case "living expense":
                if ( value.amount < (.05 * (totalIncome))){
                    comment = "Good job, you are below the 5% annual living expenses of annual income - this includes things such as cable tv, internet,  gas, and phone expenses";
                    color= "green";
                } else {
                    color="red";
                    comment = " You may be spending too much money on some living expenses - consider changing internet plans, dropping a tv subscription, or changing mobile phone providers. "
                }
                $("#living").append("<p><span style=\"color:"+color +"\" ; >" + comment + "</span></p>");

                break;
            case "transportation":
                if ( value.amount < (.10 *(totalIncome))){
                    comment = "Good job, you are spending less than 10% on transportation costs"
                    color= "green";
                } else {
                    color="red";
                    comment = "You might be spending too much on transportation costs";
                }
                $("#transportation").append("<p><span style=\"color:"+color +"\" ; >" + comment + "</span></p>");
                break;
        }
    });
}

function findByType(data) {
    // var data = collectTypeCategory(getData());
    var singleItem = [
        {
            income: {
                category: "",
                amount: "0",
                counter: ""
            },
            expense: {
                category: "",
                amount: "0",
                counter: ""
            }
        }
    ];
    var max = Math.max.apply(null,
        Object.keys(data).map(function(e) {
            return data[e]['amount'];
        }));
}

/*
 Lets Set up the form and make sure proper check boxes apear when needed
 Listener are Here
 */

/*
 Listen for the trantype RADIO BUTTONS to change
 */
$('input:radio[name="trantype"]').change(function () {
    //// This determintes the value - now lets put this into a listener
    if ($('#radIncome').is(':checked')) {
        $('#incomeList').show();
        $('#expenseList').hide();
    } else if (!$('#radIncome').is(':checked')) {
    }

    if ($('#radExpense').is(':checked')) {
        $('#incomeList').hide();
        $('#expenseList').show();
    } else if (!$('#radEpense').is(':checked')) {
    }
});

/*
 Checkboxes Enable and Disable options based on which box is pressed
 */
$('input:checkbox[name="incomeCB"]').change(function () {
    if (this.checked) {
        $('input:checkbox[name="incomeCBList"]').removeAttr("disabled");
    } else {
        $('input:checkbox[name="incomeCBList"]').attr("disabled", true);

    }
});
$('input:checkbox[name="expenseCB"]').change(function () {
    if (this.checked) {
        $('input:checkbox[name="expenseCBList"]').removeAttr("disabled");
    } else {
        $('input:checkbox[name="expenseCBList"]').attr("disabled", true);

    }
});
var token = localStorage.getItem('idToken');
if (token) {
    showLoggedIn();
} else {
}
// Display the user's profile
function showLoggedIn() {
    var profile = JSON.parse(localStorage.getItem('profile'));
    document.getElementById('nick').textContent = profile.nickname;
}
//1249 -> 793
var lock = new Auth0Lock(clientId, domain, {
    auth: {
        redirectUrl: 'http://localhost:63343/userprofile/graphs.html',
        responseType: 'token',
        params: {
            scope: 'openid email' // Learn about scopes: https://auth0.com/docs/scopes
        }
    }
});

lock.on("authenticated", function (authResult) {
    console.log("shitfuckinlockonauth");
    // Use the token in authResult to getProfile() and save it to localStorage
    lock.getProfile(authResult.idToken, function (error, profile) {
        if (error) {
            // Handle error
            return;
        }
        console.log("authresult");
        console.log(authResult.idToken);
        localStorage.setItem('idToken', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
    });
});