// 
//  *********************************************************
// 
// DIR: cd Google\ Drive/dev/js/Meteor/Meteor_apps/goal-line
// 
//  *********************************************************
// 

goals = new Mongo.Collection('goals'); 
settings = new Mongo.Collection('settings'); 

if(Meteor.isClient) {

    // **********************************
    // ------ FRONT END JS ------------
    // **********************************

    Meteor.subscribe('goals', function(){
        console.log(goals.find().fetch());
    }); 

    Meteor.subscribe('settings', function() {
       
    });

    function initSettings() {
        console.log('settings length before  - ' + settings.find().fetch().length);

        var dayRadioCheck1 = null; 
        var dayRadioCheck2 = 'checked'; 
        var dayRadioCheck3 = null; 

        var fontRadioCheck1 = null; 
        var fontRadioCheck2 = 'checked'; 
        var fontRadioCheck3 = null; 

        var cdRadioCheck1 = null; 
        var cdRadioCheck2 = 'checked'; 

        var descRadioCheck1 = null; 
        var descRadioCheck2 = 'checked'; 

        var dateRadioCheck1 = null; 
        var dateRadioCheck2 = 'checked'; 
        var dateRadioCheck3 = null; 

        if(settings.find().fetch().length < 1) {
            Meteor.call('initSettings', dayRadioCheck1, dayRadioCheck2, dayRadioCheck3, fontRadioCheck1, fontRadioCheck2,fontRadioCheck3, cdRadioCheck1,cdRadioCheck2,descRadioCheck1,descRadioCheck2,dateRadioCheck1,dateRadioCheck2,dateRadioCheck3); 
        }

        console.log('settings length after  - ' + settings.find().fetch().length);
    }


  

    Meteor.call('removeInitGoal', "initialDate"); 

    
    var currentMousePosition = 0
    var globalZoom = 1; 

    var pastYears = 5;
    var futureYears = 15;

    var minTotalDays = 0; 
    var maxTotalDays = 0; 
    var lineHeight = 0; 
    var showGoalFired = 0;
                                                        //   
    var calendar =      [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];  
    var leapCalendar =  [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; 

    function getTotalDay(dateObject) {

        var yearDays = dateObject.getFullYear() * 365.26; 
        var monthDays = getMonthDays(dateObject.getMonth() + 1);
        var days = dateObject.getDate(); 

        var goalTotalDay;

        function getMonthDays(month) {
            var currentMonthDays = 0; 
            if((dateObject.getFullYear() % 4 == 0) || ((dateObject.getFullYear() % 100 == 0) && (dateObject.getFullYear() % 400 == 0))) {
                for(i = 0; i < month; i++) {
                    currentMonthDays += leapCalendar[i]; 
                }
            } else {
                for(i = 0; i < month; i++) {
                    currentMonthDays += calendar[i]; 
               }
            }
            return currentMonthDays;
        }

        goalTotalDay = yearDays + monthDays + days; 
        return goalTotalDay; 
    }

    function getDate(totalDays) { 

       var calendar =      [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];  
       var leapCalendar =  [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
       var currentCalendar = [];   

       var year, month, day; 

       // get Year     
       var goalYear = totalDays / 365.26;
       var goalYearParsed = parseInt(goalYear); 

       //get Month and Days

       //set calendar
       if((goalYearParsed % 4 == 0) || ((goalYearParsed % 100 == 0) && (goalYearParsed % 400 == 0))) {
          currentCalendar = leapCalendar; 
       } else {
          currentCalendar = calendar; 
       }

       var daysLeft = (goalYear - parseInt(goalYear)) * 365.26; 
       var daysLeftVar = daysLeft; 
       var daysLeftLoop = true; 
       var goalMonths = 0; 
       var singleDaysleft = 0;

       //get months/days
       var t = 0;
       while((daysLeftVar > 0) && (daysLeftLoop == true)) {
          if((daysLeftVar - currentCalendar[t]) > 0) {
             daysLeftVar -= currentCalendar[t]; 
             t++;
          } else {
             goalMonths = t; 
             singleDaysleft = daysLeftVar; 
             daysLeftLoop = false; 
          }
       }

       year = parseInt(goalYear);
       month = parseInt(goalMonths);
       day = parseInt(singleDaysleft); 

       return {
          yearFull: goalYear, 
          monthFull: goalMonths,
          dayFull: singleDaysleft, 
          year: year, 
          month: month,
          day: day,
          object: new Date(year, month - 1, day),
          daysLeft: daysLeft
       }  
    } 

    function initLine() {
        $('.goalLine').css({height: lineHeight}, 3000);
        $('#line').css({height: lineHeight}, 3000); 
    }

    // function initSettings() {

    //     settingLength = settings.find().fetch().length; 
    //     console.log('settingLength - ' + settingLength); 
    //     if(settings.find().fetch().length < 1) {
    //         console.log('settings initiated'); 
    //         settings.insert({pastYearsAdd: 5, futureYearsAdd: 15}); 
    //     } else {
    //         console.log('settings allready intiated');
    //     }
    // }

    var initialDate = new Date(); 
    var intialTotalDay = getTotalDay(initialDate); 
    console.log(initialDate);
    Meteor.call('addGoal', 'test', 'test', initialDate, intialTotalDay, 'initialDate');


    $(document).ready(function(){
        // $('.showGoalLineWrapper').on('mousemove', function(e) {
        //     $('#marker').css({top:e.pageY}); 
        // });

        $('#goalLineLeft').on('mousemove', function(e) {

            var offset = $(this).offset();

            currentMousePosition = parseInt((e.pageY - offset.top));

            var placeholderTotalDay = (currentMousePosition / globalZoom) + minTotalDays;

            var date = getDate(placeholderTotalDay); 
           
            // $("#minTotalDays").text(minTotalDays);
            // $("#currentMousePosition").text(currentMousePosition);
            // $("#placeHolderTotalDays").text(placeholderTotalDay);
            // $("#year").text(date.year);
            // $("#daysLeft").text(date.daysLeft);
            // $("#month").text(date.month); 
            // $("#day").text(date.day); 
            // $("#object").text(date.object);
            $("#markerInfo").text(date.day + ' / ' + date.month + ' / ' + date.year); 

        });

        $('#zoomIn').click(function(){
            if(globalZoom < 6) {
                globalZoom++; 
            }  
        })
        $('#zoomOut').click(function(){
            if(globalZoom > 0) {
                globalZoom--; 
            }
        })

        $('#addFutureYears').click(function(){
            console.log('future');
            pastYears += 10; 
        }); 
        $('#addPastYears').click(function(){
            console.log('past');
            futureYears += 10; 
        }); 

        $('#menuBarButton').click(function(){
            $('.settingsWrapper').slideToggle("slow");
        });

    }); 

    setInterval(function(){
        $('#currentDayPulseWrapper').find('#currentDayPulse').animate({height: '20px', width: '20px', opacity: 0}, 400, function(){
               $('#currentDayPulseWrapper').find('#currentDayPulse').css({height: '4px', width: '4px', opacity: 1});
        }); 
    }, 1000); 

    // ********************************************************************
    // ------ Meteor functions ------------
    // ********************************************************************

    // ---------- MENU --------------

    Template.menu.helpers({
        initSettings: function() {

        }, 
        data: function() {
            return settings.find().fetch()[0]; 
        }
    })

    Template.menu.events({
        'click label':function(e, template) {
            // var dayRadio = e.target.day.value; 

            console.log(e); 
            console.log(e.target.previousElementSibling.value); 

            var currentRadio = e.target.previousElementSibling; 
            var currentRadioValue = e.target.previousElementSibling.value;
            var currentRadioId = e.target.previousElementSibling.id;


            // day

            if(currentRadioId == "radio1_day_1") {
                dayRadioCheck1 = 'checked';
                dayRadioCheck2 = null; 
                dayRadioCheck3 = null;
            } 
            if(currentRadioId == "radio2_day_2") {
                dayRadioCheck1 = null;
                dayRadioCheck2 = 'checked'; 
                dayRadioCheck3 = null;
            } 
            if(currentRadioId == "radio3_day_3") {
                dayRadioCheck1 = null;
                dayRadioCheck2 = null; 
                dayRadioCheck3 = 'checked';
            } 

            //font 

            if(currentRadioId == "radio1_font_1") {
                fontRadioCheck1 = 'checked';
                fontRadioCheck2 = null; 
                fontRadioCheck3 = null;
            } 
            if(currentRadioId == "radio2_font_2") {
                fontRadioCheck1 = null;
                fontRadioCheck2 = 'checked'; 
                fontRadioCheck3 = null;
            } 
            if(currentRadioId == "radio3_font_3") {
                fontRadioCheck1 = null;
                fontRadioCheck2 = null; 
                fontRadioCheck3 = 'checked';
            } 


            var fontRadio = $('input:radio[name="font"]:checked').val();
            var fontRadioCheck1, fontRadioCheck2, fontRadioCheck3; 

            switch(fontRadio) {
                case "1":
                    fontRadioCheck1 = 'checked';
                    fontRadioCheck2 = null; 
                    fontRadioCheck3 = null;
                    break; 
                case "2":
                    fontRadioCheck1 = null;
                    fontRadioCheck2 = 'checked'; 
                    fontRadioCheck3 = null;
                    break;  
                case "3":
                    fontRadioCheck1 = null;
                    fontRadioCheck2 = null; 
                    fontRadioCheck3 = 'checked';
                    break;  
            }

            var cdRadio = $('input:radio[name="cd"]:checked').val();
            var cdRadioCheck1, cdRadioCheck2; 

            switch(cdRadio) {
                case "1":
                    cdRadioCheck1 = 'checked';
                    cdRadioCheck2 = null; 
                    cdRadioCheck3 = null;
                    break; 
                case "2":
                    cdRadioCheck1 = null;
                    cdRadioCheck2 = 'checked'; 
                    cdRadioCheck3 = null;
                    break; 
            }

            var descRadio = $('input:radio[name="desc"]:checked').val();
            var descRadioCheck1, descRadioCheck2;

            switch(descRadio) {
                case "1":
                    descRadioCheck1 = 'checked';
                    descRadioCheck2 = null; 
                    descRadioCheck3 = null;
                    break; 
                case "2":
                    descRadioCheck1 = null;
                    descRadioCheck2 = 'checked'; 
                    descRadioCheck3 = null;
                    break;
            }

            var dateRadio = $('input:radio[name="date"]:checked').val();
            var dateRadioCheck1, dateRadioCheck2, dateRadioCheck3;

            switch(dateRadio) {
                case "1":
                    dateRadioCheck1 = 'checked';
                    dateRadioCheck2 = null; 
                    dateRadioCheck3 = null;
                    break; 
                case "2":
                    dateRadioCheck1 = null;
                    dateRadioCheck2 = 'checked'; 
                    dateRadioCheck3 = null;
                    break;  
                case "3":
                    dateRadioCheck1 = null;
                    dateRadioCheck2 = null; 
                    dateRadioCheck3 = 'checked';
                    break;  
            } 

            var currentID = Meteor.userId();


            Meteor.call('updateSettings', currentID, dayRadioCheck1, dayRadioCheck2, dayRadioCheck3, fontRadioCheck1, fontRadioCheck2,fontRadioCheck3, cdRadioCheck1,cdRadioCheck2,descRadioCheck1,descRadioCheck2,dateRadioCheck3,dateRadioCheck1,dateRadioCheck2 );


        }
    })

    // ---------- ACCOUNTS --------------

    Template.login.events({
        'submit #loginForm':function(e) {
            e.preventDefault(); 

            var email = e.target.loginEmail.value; 
            var password = e.target.loginPassword.value; 

            //validate here 

            Meteor.loginWithPassword(email, password, function(err){
                if(err) {
                    console.log(err)
                } else {
                    console.log('login successfull'); 
                    initSettings(); 
                }      
            })

            return false; //to prevent form from reloading the page
        }
    }); 

    Template.register.events({
         'submit #registerForm':function(e) {
            e.preventDefault(); 

            var email = e.target.registerEmail.value; 
            var password = e.target.registerPassword.value; 

            //validate here 

            Accounts.createUser({email: email, password: password}, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log('register successfull'); 
                }
            })

            return false; //to prevent form from reloading the page
        }
    });

    // ---------- GOAL --------------

    // Add Goal Form 
    Template.addGoalForm.events({
        'submit form': function(e, template) {

            e.preventDefault();

            var goalName = template.find('#goalName').value; 
            var goalDescription = template.find('#goalDescription').value; 
            var goalYear = parseInt(template.find('#goalYear').value); 
            var goalMonth = parseInt(template.find('#goalMonth').value) - 1; 
            var goalDay = parseInt(template.find('#goalDay').value); 
            var goalDate = new Date(goalYear, goalMonth, goalDay); 
            // var goalTotalDay = ((goalDate.getFullYear() - 1) * 365.26) + (goalDate.getMonth() * 30) + (goalDate.getDate() + 1); 
            console.log('submmitform ---------');
            var goalTotalDay = getTotalDay(goalDate); 

            Meteor.call('addGoal', goalName, goalDescription, goalDate, goalTotalDay);

            template.find('#goalName').value = ''; 
            template.find('#goalDescription').value = ''; 
            template.find('#goalYear').value = ''; 
            template.find('#goalMonth').value = ''; 
            template.find('#goalDay').value = ''; 
        } 
    });

    // Goal Line 
    Template.showGoalLine.helpers({  
        //this function is executed as a loop in the template file. 
        showGoal: function() { 

            var currentDay; 
            var currentTotalDay = 0;
            var currentRelativePosition = 0;

            var monthsArray = []; 

            //get current day
            currentDay = new Date(); 
            currentTotalDay = getTotalDay(currentDay); 

            minTotalDays = parseInt(currentDay.getFullYear() - 5) * 365.26;
            maxTotalDays = parseInt(currentDay.getFullYear() + 15) * 365.26;

            currentRelativePosition = (currentTotalDay - minTotalDays) * globalZoom; 

            //set relativePosition 
            for(var i = 0; i < goals.find().fetch().length; i++) {
                var currentTotalDays = goals.find().fetch()[i].goalTotalDay; 
                var currentID = goals.find().fetch()[i]._id; 
                var relativePosition = currentTotalDays - minTotalDays;
                Meteor.call('addRelativePosition', currentID, (relativePosition * globalZoom)); 
            }

            //set height 
            lineHeight = globalZoom * (maxTotalDays - minTotalDays + 500);

            initLine(); 

            //update days left

            for(i = 0; i < goals.find().fetch().length; i++) {

                var currentGoalId = goals.find().fetch()[i]._id; 
                var currentGoalTotalDays = goals.find().fetch()[i].goalTotalDay;
                var currentGoalDaysLeft = parseInt(goals.find().fetch()[i].goalTotalDay - currentTotalDay);
                goals.update({_id: currentGoalId}, {$set: {goalDaysLeft: currentGoalDaysLeft}}); 

            }

            showGoalFired++; 


            checkShowGoalFinish(); 
            
            function checkShowGoalFinish() {  
                $('.goal').hover(

                    function(){
                        $(this).find('.flyFormInput').css({display: 'inline-block'});
                        $(this).find('.flyGoalName').css({display: 'none'});
                        $(this).find('.flyGoalDescription').css({display: 'none'});
                        $(this).find('.buttons').css({display: 'block'});
                    }, 

                    function(){
                        $(this).find('.flyFormInput').css({display: 'none'});
                        $(this).find('.flyGoalName').css({display: 'inline-block'});
                        $(this).find('.flyGoalDescription').css({display: 'inline-block'});
                        $(this).find('.buttons').css({display: 'none'});
                    }
                ); 
            }

            var intialPostElement = goals.findOne({initialName: 'initialDate'});

            if(intialPostElement === undefined) {
                
            } else {
                 $('.' + intialPostElement._id).css({display: "none"});
            }

            return { 
                getGoals:goals.find(),  
                getCurrentDay: {
                    currentDay: currentDay,
                    currentTotalDay: currentTotalDay,
                    currentRelativePosition: currentRelativePosition
                },
                monthsArray: monthsArray,
                initLine: initLine()
            } 
        }
    });

    Template.showGoalLine.events({
        'click #removeButton':function(e) {
            e.preventDefault(); 
            var selectedEventID = this._id; 
            Meteor.call('removeGoal', selectedEventID);

        }, 
        'submit .flyForm':function(e, template)
         {
            e.preventDefault();

            //parsing user date data 
            var goalPriority = e.target.radios.value; 
            var check1, check2, check3;

            console.log(goalPriority); 

            switch(goalPriority){
                case "1":
                    check1 = 'checked';
                    check2 = null; 
                    check3 = null;
                    break; 
                case "2":
                    check1 = null;
                    check2 = 'checked'; 
                    check3 = null;
                    break;  
                case "3":
                    check1 = null;
                    check2 = null; 
                    check3 = 'checked';
                    break;  
            }

            var goalName = template.find('.flyFormGoalName.' + this._id).value; 
            var goalDescription = template.find('.flyFormGoalDescription.' + this._id).value; 
            var goalYear = parseInt(template.find('.flyFormGoalYear.' + this._id).value); 
            var goalMonth = parseInt(template.find('.flyFormGoalMonth.' + this._id).value) - 1; 
            var goalDay = parseInt(template.find('.flyFormGoalDay.' + this._id).value); 
            var goalDate = new Date(goalYear, goalMonth, goalDay);

            //getTotalDay function 
            var goalTotalDay = getTotalDay(goalDate); 
                
            //get relative position; 
            var relativePosition; 

            if(goalTotalDay >= minTotalDays) {
                relativePosition = goalTotalDay - minTotalDays; 
            } else {
                relativePosition = goalTotalDay; 
            }

            Meteor.call('updateGoal', this._id, goalName, goalDescription, goalDate, goalYear, goalMonth, goalDay, goalTotalDay, relativePosition, goalPriority, check1, check2, check3); 
            
        },
        //get f
        'click #goalLineLeft':function(){
            
            //reverse parse 
            var placeholderTotalDay = (currentMousePosition / globalZoom) + minTotalDays;
            var date = getDate(placeholderTotalDay); 
            
            var currentDay = new Date(); 
            var currentTotalDay = getTotalDay(currentDay); 
          
            //add to database with parsed date 
            Meteor.call('addGoal', 'placeholder name', 'placeholder description', date.object, placeholderTotalDay, null, currentTotalDay, 'default', 'checked', null, null); 
        },
        // 'click .goal':function() {
        //    $('.flyFormInput.' + this._id).css({display: 'inline-block'});
        //    $('.buttons.' + this._id).css({display: 'block'});
        //    $('.' + this._id + ' .flyGoalName').css({display: 'none'});
        //    $('.' + this._id + ' .flyGoalDescription').css({display: 'none'});
        // }, 
        'click #goalLineRight':function() {

        }
    });
}

if(Meteor.isServer) {

    console.log(Meteor.users.find().fetch()); 
    console.log(settings.find().fetch()); 

    Meteor.publish('goals', function(){
        this.ready();
        return goals.find({createdBy: this.userId}); 
    })

    Meteor.publish('settings', function(){
        return settings.find({createdBy: this.userId}); 
    })

    Meteor.methods({
        addGoal:function(goalName, goalDescription, goalDate, goalTotalDay, intialName, currentTotalDay, goalPriority, check1, check2, check3){
            goals.insert({
                createdBy: this.userId,
                initialName: intialName,
                goalName: goalName, 
                goalDescription: goalDescription,
                goalDate: goalDate,
                goalYear: goalDate.getFullYear(),
                goalMonth: goalDate.getMonth() + 1,
                goalDay: goalDate.getDate(),
                goalTotalDay: goalTotalDay,   
                goalDaysLeft: parseInt(goalTotalDay - currentTotalDay),
                goalPriority: goalPriority,
                check1: check1,
                check2: check2,
                check3: check3
            });
        }, 
        addRelativePosition:function(currentID, relativePosition) {
            goals.update({_id: currentID}, {$set: {relativePosition: relativePosition}})
        },
        removeGoal:function(selectedEventID) {
            goals.remove(selectedEventID); 
        }, 
        removeInitGoal:function(intialName){
            goals.remove({initialName: intialName});
        },
        updateGoal:function(currentID, goalName, goalDescription, goalDate, goalYear, goalMonth, goalDay, goalTotalDay, relativePosition, goalPriority, check1, check2, check3) {
            goals.update({_id: currentID}, {$set: {
                goalName: goalName,
                goalDescription: goalDescription,
                goalDate: goalDate,
                goalYear: goalDate.getFullYear(),
                goalMonth: goalDate.getMonth() + 1, 
                goalDay: goalDate.getDate(), 
                goalTotalDay: goalTotalDay,
                relativePosition: relativePosition,
                goalPriority: goalPriority,
                check1: check1,
                check2: check2,
                check3: check3
            }})
        },
        updateSettings: function(currentID, dayRadioCheck1, dayRadioCheck2, dayRadioCheck3, fontRadioCheck1, fontRadioCheck2,fontRadioCheck3, cdRadioCheck1,cdRadioCheck2,descRadioCheck1,descRadioCheck2,dateRadioCheck3,dateRadioCheck1,dateRadioCheck2) {
                settings.update({createdBy: currentID}, {$set: {
                    dayRadioCheck1: dayRadioCheck1,
                    dayRadioCheck2: dayRadioCheck2,
                    dayRadioCheck3: dayRadioCheck3,
                    fontRadioCheck1: fontRadioCheck1, 
                    fontRadioCheck2: fontRadioCheck2,
                    fontRadioCheck3: fontRadioCheck3, 
                    cdRadioCheck1: cdRadioCheck1,
                    cdRadioCheck2: cdRadioCheck2,
                    descRadioCheck1: descRadioCheck1,
                    descRadioCheck2: descRadioCheck2,
                    dateRadioCheck3: dateRadioCheck3,
                    dateRadioCheck1: dateRadioCheck1,
                    dateRadioCheck2: dateRadioCheck2
                }}); 
        },
        initSettings: function(dayRadioCheck1, dayRadioCheck2, dayRadioCheck3, fontRadioCheck1, fontRadioCheck2,fontRadioCheck3, cdRadioCheck1,cdRadioCheck2,descRadioCheck1,descRadioCheck2,dateRadioCheck3,dateRadioCheck1,dateRadioCheck2) {
            settings.insert({
                createdBy: this.userId,
                dayRadioCheck1: dayRadioCheck1,
                dayRadioCheck2: dayRadioCheck2,
                dayRadioCheck3: dayRadioCheck3,
                fontRadioCheck1: fontRadioCheck1, 
                fontRadioCheck2: fontRadioCheck2,
                fontRadioCheck3: fontRadioCheck3, 
                cdRadioCheck1: cdRadioCheck1,
                cdRadioCheck2: cdRadioCheck2,
                descRadioCheck1: descRadioCheck1,
                descRadioCheck2: descRadioCheck2,
                dateRadioCheck3: dateRadioCheck3,
                dateRadioCheck1: dateRadioCheck1,
                dateRadioCheck2: dateRadioCheck2
            }); 
        }
    });
}






























