// Details about how big this chart will be
var color = d3.scale.category10(); // Soon, make a range of green colours and red colours
var width = 500;
var height = 500;
var radius = Math.min(width, height) / 2; // not used just yet

/////////////
var clientId = 'lJkPQODAsLa1imQ7pHVMk12dHPfbY5Wp';
var domain = 'moneymoney.auth0.com';
//var lock = new Auth0Lock(clientId, domain);

var incomeCats = {
    "paycheque": "Pay Cheque",
    "osap": "OSAP",
    "bursary": "Bursary",
    "allowance": "Allowance",
    "loan": "Loan",
    "onetime": "One Time"
};

var expenseCats = {
    "rent" : "Rent",
    "living": "Living Expense",
    "food": "Food",
    "clothing": "Clothing",
    "entertainment": "Entertainment"
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
    // building a legend is as simple as binding
    // more elements to the same data. in this case,
    // <text> tags
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
    convertDate(data);
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


    var count = 0;

    // / Create a tool tip

    /*
     var tip = d3.tip(svg)
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function(d) {
     return "<strong>Description: </strong> <span style='color:red'>" + d.desc + "</span>";
     })
     svg.call(tip);
     */


    /*                              Work on a tool tip      */
    /*
     var tip = d3.select("body")
     .append("div")
     .style("position", "absolute")
     .style("z-index", "10")
     .style("visibility", "hidden")
     // .text(function(d){return d.desc});
     .text(data.map(function(data) {
     return "<strong>Description:</strong> <span style='color:black'>" + data.desc + "</span>";
     }));
     */

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
            div .html("<span style='font-weight:bold, font-size:15dp'> Description: "+d.desc
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
    /// This one is a bit harder to determine if it's appropiate

    ///clear the div and start the chart
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
// })
//}

////////////////////////////////ABOVE IS ALL CHARTS///////////////////

////////////////////////////////BELOW IS TESTING AND MANIPULATING THE DATASET///////////

/*
 Below is a transaction
 */
function followTheMoney() {

    ///////////// Example for expense object
    var categoryString = $('#category input:radio:checked').val();
    var typeString = $('#trantype input:radio:checked').val();
    var amountString = document.getElementById('amount').value;
    var amountNum = 300;
    var descString = document.getElementById('description').value;
    var date = new Date();
    var expenseObject = [];
    var token = localStorage.getItem('idToken');


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
            console.log('success!');
            alert("Successfully posted");
        },
        error: function () {
            alert("Sorry, there was an error please try again");
        }


    });
    //reload the balance on screen
    showBalance();
    //to do possibly update the graph
};

/*                        User Specific                             */
/*                      User Specific grabData      */
function grabData2() {

    ///////////// Example for expense object
    var token = localStorage.getItem('idToken');


    userObject = {
        "token":"12345",
    };
    $.ajax({
        type: "POST",
        async: false,
        url: "http://moneymoney.zapto.org:8080/userData",
        // url:"/Capstone2/data/expenses.json",
        contentType: "application/json",
        dataType:"json",
        data: JSON.stringify(userObject),
        success: function (data) {
            console.log('success on getData2');
            console.log(data);
        },
        error: function () {
            alert("Sorry, there was an error please try again");
        }


    });
    //reload the balance on screen
 //   showBalance();
    //to do possibly update the graph
};

/*                  User Specific Posting Transaction       */
function userTran() {

    ///////////// Example for expense object
  //  var categoryString = $('#category input:radio:checked').val();
    var typeString = $('#trantype input:radio:checked').val();
    switch ($('#trantype input:radio:checked').val()){
        case "expense":
            var categoryString = $('#expenseList input:radio:checked').val();
            break;
        case "income":
            var categoryString = $('#incomeList input:radio:checked').val();
            break;
    };
    var amountString = document.getElementById('amount').value;
    var amountNum = 300;
    var descString = document.getElementById('description').value;
    var date = new Date();
    var expenseObject = [];
    var token = localStorage.getItem('idToken');

    console.log(categoryString);

    expenseObject = {
        "token":"12345",
        "type": typeString,
        "amount": amountString,
        "desc": descString,
        "category": categoryString,
        "date": date
    };
    $.ajax({
        type: "POST",
        async: false,
        url: "http://moneymoney.zapto.org:8080/userInsert",
        // url:"/Capstone2/data/expenses.json",
        contentType: "application/json",
        data: JSON.stringify(expenseObject),
        success: function () {
            console.log('success!');
            alert("Successfully posted");
        },
        error: function () {
            alert("Sorry, there was an error please try again");
        }


    });
    //reload the balance on screen
    showBalance();
    //to do possibly update the graph
};


/*                  End of User Specific                        */


/*
 This section will be all about the data
 -> Getting the data
 -> Filters for the data
 -> Apply the filters to the data
 */
/*
 Grab and return data
 */

function getData() {
    var returnThis = [];
    $.ajax({
        type: "GET",
        async: false,
        // url: "/Capstone2/data/expenses.json",
        url: "http://moneymoney.zapto.org:8080",
        // data: "",
        dataType: "json",
        success: function (data) {
            console.log(data);
            returnThis = data;
        },
        error: function (err) {
            console.log(err);
        }
    });

    return returnThis;
};


//// Select only these dates
function transactionsXDaysOld(age, data) {

    console.log("Age : " + age + "data " + data.length);
    var cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - age);
    data = data.filter(function (d) {
        return new Date(d.date) > cutoffDate;
    });
    return data;
};
//////Sort dates
function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return (new Date(a.date)) - (new Date(b.date));
};
//this returns amounts larger than a value
function transactionsLargerThan(amount) {
    return data => data.amount >= amount;
};

//this returns amounts less than a value
function transactionsSmallerThan(amount) {
    return data => data.amount <= amount;
};


function selectCat(data, a) {
    var tempData = [];
    $.each(a, function (key,val) {
        tempData =    tempData.concat(data.filter(x=>x.category === val));
    });
    return tempData;
};
function selectType(data, a) {
    var tempData = [];
    console.log("inside type : " + data + " and a : " + a);
    $.each(a, function (key,val) {
        tempData =    tempData.concat(data.filter(x=>x.type === val));
    });
    return tempData;
};

function convertDate(data){
    $.each(data, function(key, val){

        //var newDate = val["date"].moment().format('D MMM, YYYY');
        var newDate = new Date(val['date']);
        //  newDate.setDate(val["date"]);
        //newDate = Date.parse(val['date']);
        // newDate.format('DD MM, YYY');
        //    var day = newDate.getDay();
        // console.log("key : " + key + " val: " + val["date"]);
        newDate = newDate.getDay() + "/" +newDate.getMonth() +"/"+newDate.getFullYear();
        val['date'] = newDate;
        console.log(newDate);
        data= data.sort(sortByDateAscending);
        return data;
    })
};
function handleData(data) {
    var categories = [];
    var types = [];
    var duration;
    // categories = $("input:checkbox[name='incomeCBList']:checked").val;

    /*              Type income or expense or both          */
    if ($("input:checkbox[name='incomeCB']").is(":checked")) {
        console.log("inside income type   " + $("input:checkbox[name='incomeCB']").val());
        types.push($("input:checkbox[name='incomeCB']").val());

        $("input:checkbox[name='incomeCBList']:checked").each(function () {
            var cat = $(this).val();
            categories.push(cat);
        });
    }
    ;
    if ($("input:checkbox[name='expenseCB']").is(":checked")) {

        types.push($("input:checkbox[name='expenseCB']").val());
        $("input:checkbox[name='incomeCBList']:checked").each(function () {
            var cat = $(this).val();
            categories.push(cat);
        });
    }
    ;
    // console.log(types.toString());
    /*                  Check boxes for Categories                      */


    /*                  Duration                        */
    // if ($("input:radio[name='months']:checked") == true){
    duration = ($("input:radio[name='months']:checked").val());
    duration = duration * 30; // lets not worry about specific months just yet
    //  }
    console.log("did we start with data? :" + data.length + " and types : " + types.length);
    if (types.length > 0) {

        var newData = selectType(data, types);
        console.log("data length type" + newData.length);
    }
    if (categories.length > 0) {
        newData = selectCat(newData, categories);
        console.log("duration period" + duration + "newData length" + newData.length)
    }
    newData = transactionsXDaysOld(duration, newData);
    console.log("data length age" + newData.length);
    return (newData);
}


///
///         Below will be html listeners and how to manipulate the dom
///
/*
 Load the navbar
 */
$('#navbar').load('/navframe.html');


/*
 Run on certain pages run these scripts asap
 */
$(function () {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
    } else {
        // Sorry! No Web Storage support..
    }

    if ($('body').is('.graphs')) {

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
                    + "value='" + key + "'autocomplete='off'>" + value
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
                    + "value='" + key + "'autocomplete='off' checked>" + value
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
                " <label> "
                + "  <input name='incomeCBList' id='" + value + "Cb' value='"+value+"' type='checkbox' disabled /> " + key
                + "</label>"
            )
        });

        $.each(expenseCats, function (value, key) {

            $("#graphSelectorContainer .expenseCbs").append(
                " <label> "
                + "  <input name='expenseCBList' id='" + value + "Cb' type='checkbox' disabled /> " + key
                + "</label>"
            )
        });
        showBalance();
        /* This handles the user profile and balance */
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            if (localStorage.getItem("ValidUser")) {
                showBalance();

            } else {
                // probably invalid user
                //  $('body').empty();
                //   $('body').innerHtml = "Please log in";
            }

        } else {
        }
    } if ($('body').is('login')) {
        var btn_login = document.getElementById("login");
        btn_login.addEventListener("click", lock.show());
        init();
    }
});

/*
 Shows the balance of the account on the graphs page
 */
function showBalance() {

    var data = [];
    data = getData();

    var balance = 0; // start at 0 
    for (var i = 0; i < data.length; i++) {
        if (data[i].type === "income") {
            balance += parseFloat(data[i].amount);
        } else if (data[i].type === "expense") {
            balance -= parseFloat(data[i].amount);
        }
        // console.log("this is the balance: " + balance.toFixed(2));

    }

    //// Set the text and adjust the css        
    $("#totalBalance").html(balance.toFixed(2));
    if (balance > 0) {
        $("#totalBalanceContainer").toggleClass("alert-danger", false);
        $("#totalBalanceContainer").toggleClass("alert-success", true);
    } else if (balance < 0) {

        $("#totalBalanceContainer").toggleClass("alert-danger", true);
        $("#totalBalanceContainer").toggleClass("alert-success", false);
    }
};


/*
 *   Lets Set up the form and make sure proper check boxes apear when needed
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

var token = localStorage.getItem('idToken');
if (token) {
    console.log("inside toke");
    showLoggedIn();
} else {
    console.log("no token");
}
var init = function () {
    var id_token = localStorage.getItem('idtoken');
    if (id_token) {
        console.log("some toke");
    } else {
        console.log(" no toke");
    }
};

// Display the user's profile
function showLoggedIn() {
    var profile = JSON.parse(localStorage.getItem('profile'));
    document.getElementById('nick').textContent = profile.nickname;
};



/*
 Below will be on Depreciated code, on used or were for testing
 All should be commented out
 */


/////////////////           Functions to help test          /////////////////////
function printThis(word) {
    console.log(word);
};
function printTest() {
    console.log("test");
};


/////////// Validation for form elements
/*
 function validateEmail() {
 var email = document.getElementById('NewUserEmail').value;

 var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 if (email.match(mailformat)) {
 document.getElementById('NewUserFirstName').focus();
 document.getElementById('emailValid').innerHTML = '';
 return true;
 }
 else {
 document.getElementById('emailValid').innerHTML = "You have entered an invalid email address!";

 return false;
 }
 }
 */
//////////                      User Login           /////////
/*
 /////////Unsecure, for Alpha alpha
 function userLogin() {

 var LoginUsername = $("#LoginUsername").val();
 var LoginPassword = $("#LoginPassword").val();
 var ajaxPostObject = [];

 ajaxPostObject = {
 "name": LoginUsername,
 "password": LoginPassword
 };

 $.ajax({
 type: "POST",
 url: "http://moneymoney.zapto.org:8080/userlogin",
 contentType: "application/json",
 data: JSON.stringify(ajaxPostObject),
 statusCode: {
 500: function () {
 console.log("Nothing found");
 alert("Sorry, there is a network error");
 localStorage.setItem("ValidUser", false);
 },
 200: function (data) {
 console.log("we found something");
 console.log(data);
 localStorage.setItem("ValidUser", true);
 window.location.replace("/Dashboard/Graphs");
 },
 204: function () {
 localStorage.setItem("ValidUser", false);
 console.log("wrong information");
 alert("Sorry, your information is correct");

 }
 }
 });
 }
 */
///////////////////////// User Profile Features


/*
 ////////////            Being worked on         ///////////////

 //function CreateUser() {
 //    /// here we need to grab all those values from the form
 //    ///  we can verify the data first then send off to the db

 //    //email
 //    //firstname
 //    //lastname
 //    //username
 //    //password
 //    var email = document.getElementById('NewUserEmail').value
 //    console.log(email);

 //    var firstname = document.getElementById('NewUserFirstName').value;
 //    console.log(firstname);
 //    var lastname = document.getElementById('NewUserLastName').value;
 //    console.log(lastname);
 //    //var username = document.getElementById('NewUserName').value;
 //    //console.log(username);
 //    var password = document.getElementById('NewUserPassword').value;
 //    console.log(password);
 //    ///// Ensure validation
 //    var user =
 //        {
 //            "Email": email,
 //            "Firstname": firstname,
 //            "Lastname": lastname,
 //            "Password": password

 //        }

 //    var userString = email + "," + firstname + "," + lastname;
 //    ///////////// Example for expense object

 //    var typeString = "income";
 //    var amountString = "300";
 //    var amountNum = 300;
 //    var descString = "ipsum";
 //    var categoryString = "want";
 //    var date = "Monday, March 2, 2015 6:09 AM";

 //    var expenseObject = [{
 //        "type": "income",
 //        "amount": "736.68",
 //        "desc": "Test Post",
 //        "category": "want",
 //        "date": "Monday, March 2, 2015 6:09 AM"
 //    }];

 //    var expenseString = typeString + ","


 //    /////// After double checking if email exists already
 //    ///// post the data

 //    $.ajax({
 //        type: "POST",
 //        //url: "/TestData/account.json",
 //        url: "http://www.moneymoney.zapto.org:8080",
 //        data: user,
 //        success: function () { alert("Successfully posted")' },
 //        dataType: "json",
 //        contentType: "application/json"
 //    });


 //}

 */

/*    This was date testing
 ////////////// for testing purposes

 ////// understanding the date function

 //function letsFormatDates() {

 //    var data = [
 //         { date: new Date("Monday, April 2, 2015 6:09 AM") },
 //         { date: new Date("Monday, Jan 2, 2015 6:20 AM") },
 //         { date: new Date("Monday, November 2, 2015 4:09 AM") },
 //    ];


 //    var data2 = [
 //         { date: "Monday, April 2, 2015 6:09 AM" },
 //         { date: "Monday, Jan 2, 2015 6:20 AM" },
 //         { date: "Monday, November 2, 2015 4:09 AM" }
 //    ];


 //    console.log("pre sort");
 //    $.each(data, function (index, value) {
 //        console.log(value);
 //    });

 //    console.log("Presort data2");
 //    $.each(data2, function (index, value) {
 //        console.log(value);
 //    });

 //    function sortByDateAscending(a, b) {
 //        // Dates will be cast to numbers automagically:
 //        return a.date - b.date;
 //    }
 //    function sortByDateAscending2(a, b) {
 //        // Dates will be cast to numbers automagically:
 //        return (new Date(a.date)) - (new Date(b.date));
 //    }

 //    data = data.sort(sortByDateAscending);
 //    data2 = data2.sort(sortByDateAscending2);

 //    console.log("after sort");
 //    $.each(data, function (index, value) {
 //        console.log(value);
 //    });
 //    console.log("after sort data 2");
 //    $.each(data2, function (index, value) {
 //        console.log(value);
 //    });
 //    /*
 //    /////How to parse this time
 //    /////"date": "Monday, March 2, 2015 6:09 AM"

 //    d3.time.format("%A, %B %e, %Y %H:%M %p").parse;
 //    */

// Date and time parseing
//////How to parse this time 
/////"date": "Monday, March 2, 2015 6:09 AM"
/*
 d3.time.format("%A, %B %e, %Y %H:%M %p").parse

 */


// Listeners for new email - now depreciated
/*
 $("#NewUserEmail").focusin(function () {
 $(this).css("background-color", "#FFFFCC");
 });
 $("#NewUserEmail").focusout(function () {
 $(this).css("background-color", "#FFFFFF");
 validateEmail();
 });

 ////////Return expenses
 function selectExpenses() {
 return data => data.type === "expense";

 }
 //////Return income
 function selectIncome() {
 return data => data.type === "income";
 }

 /////Return categories x multiple friggen really gotta test this one eh
 function selectCategory(data, a, b, c, d) {
 var tempData = [];
 a = a || null; // this should never be null
 b = b || null;
 c = c || null;
 d = d || null;

 tempData = data.filter(x=>x.category === a);
 if (b !== null) {
 printTest();
 tempData = tempData.concat(data.filter(x=>x.category === b));
 }
 if (c !== null) {
 tempData =  tempData.concat(data.filter(x=>x.category === c));
 }
 if (d !== null) {
 tempData =   tempData.concat(data.filter(x=>x.category === d));
 }

 console.log(tempData.length);
 return tempData;
 }

 */
