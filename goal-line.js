// 
//  *********************************************************
// 
// DIR: cd Google\ Drive/dev/js/Meteor/Meteor_apps/goal-line
// 
//  *********************************************************
// 

goals = new Mongo.Collection('goals'); 

if(Meteor.isClient) {

    // **********************************
    // ------ FRONT END JS ------------
    // **********************************

    Meteor.call('removeInitGoal', "initialDate");

    var currentMousePosition = 0
    var globalZoom = 1; 

    var minTotalDays = 0; 
    var maxTotalDays = 0; 
    var lineHeight = 0; 
    var showGoalFired = 0
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

    var initialDate = new Date(); 
    var intialTotalDay = getTotalDay(initialDate); 
    console.log(initialDate);
    Meteor.call('addGoal', 'test', 'test', initialDate, intialTotalDay, 'initialDate');

    

    $(document).ready(function(){
        $('.showGoalLineWrapper').on('mousemove', function(e) {
            $('#marker').css({top:e.pageY}); 
        });

        $('#goalLineLeft').on('mousemove', function(e) {

            var offset = $(this).offset();

            currentMousePosition = parseInt((e.pageY - offset.top));

            var placeholderTotalDay = currentMousePosition + minTotalDays;

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

        $('#goalLineRight').click(function(){
            console.log('goaline clicked');
        })
    }); 

    setInterval(function(){
        $('#currentDayPulseWrapper').find('#currentDayPulse').animate({height: '20px', width: '20px', opacity: 0}, 400, function(){
               $('#currentDayPulseWrapper').find('#currentDayPulse').css({height: '4px', width: '4px', opacity: 1});
        }); 
    }, 1000); 

    // **********************************
    // ------ Meteor functions ------------
    // **********************************

    
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

            currentRelativePosition = currentTotalDay - minTotalDays; 

            //set relativePosition 
            for(var i = 0; i < goals.find().fetch().length; i++) {
                var currentTotalDays = goals.find().fetch()[i].goalTotalDay; 
                var currentID = goals.find().fetch()[i]._id; 
                var relativePosition = currentTotalDays - minTotalDays;
                Meteor.call('addRelativePosition', currentID, relativePosition); 
            }

            //set height 
            lineHeight = maxTotalDays - minTotalDays + 500;

            function initLine() {
                 $('.goalLine').css({height: lineHeight}, 3000, function(){
                    console.log('fired 1');
                 });
                 $('#line').css({height: lineHeight}, 3000, function(){
                    console.log('fired 2');
                 }); 
                 console.log('initLine fired');
            }

            initLine(); 

            //update days left

            for(i = 0; i < goals.find().fetch().length; i++) {
                var currentGoalId = goals.find().fetch()[i]._id; 
                var currentGoalTotalDays = goals.find().fetch()[i].goalTotalDay;
                var currentGoalDaysLeft = parseInt(goals.find().fetch()[i].goalTotalDay - currentTotalDay);
                goals.update({_id: currentGoalId}, {$set: {goalDaysLeft: currentGoalDaysLeft}}); 

            }

            //this is where we fight 


            


          showGoalFired++; 

            //checks if the showGoal function is finished firing 

            checkShowGoalFinish(); 
            
            function checkShowGoalFinish() {  

                

                // var goalsArray = goals.find().fetch(); 

                // if(goalsArray.length > 0) {

                //     if(showGoalFired == goals.find().fetch().length) {

                //         var sortedGoals = goals.find({}, {sort: {relativePosition: 1}}).fetch();
                        
                //         var day = 1;
                //         var month = 30; 
                //         var year = 365; 
                //         var b = 0;

                //         var currentDate = sortedGoals[0].goalMonth;
                //         var monthIndex = 0; 

                //         function appendDate() {
                //             if (currentDate == 0) {
                //                 monthsArray[0] = {currentDate: sortedGoals[0].goalMonth}; 
                //                 currentDate++
                //             } else if(currentDate < 13 && currentDate != 0) {
                //                 monthsArray[monthIndex++] = {currentDate: currentDate}; 
                //                 currentDate++;
                //             } else {
                //                 currentDate = 1; 
                //             }
                //         } 

                //         for(var i = 0; i < lineHeight; i = i+month) {
                //             appendDate();
                //         }

                //         var monthHeight = 30;  

                //         for(var i = 1; i < monthsArray.length; i++) {
                //             monthsArray[i].dateHeight = monthHeight;
                //             monthHeight+=30;
                //         }
                //     }
                // }

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
                console.log('nothing');
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

            //parsing user input data 

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

            Meteor.call('updateGoal', this._id, goalName, goalDescription, goalDate, goalYear, goalMonth, goalDay, goalTotalDay, relativePosition); 
            
        },
        //get f
        'click #goalLineLeft':function(){
            
            //reverse parse 
            var placeholderTotalDay = currentMousePosition + minTotalDays; 

            // var goalYear = parseInt(placeholderTotalDay / 365.26);
            // var goalMonth = parseInt((placeholderTotalDay - ((goalYear - 1) * 365)) / 30) + 1;
            // var goalDay = parseInt((((placeholderTotalDay - ((goalYear - 1) * 365)) / 30) - (goalMonth - 1)) * 30); 
            // var goalDate = new Date(goalYear, goalMonth, goalDay); 

            var date = getDate(placeholderTotalDay); 
            
            var currentDay = new Date(); 
            var currentTotalDay = getTotalDay(currentDay); 
          
            //add to database with parsed date 
            Meteor.call('addGoal', 'placeholder name', 'placeholder description', date.object, placeholderTotalDay, null, currentTotalDay); 
        },
        'click .goal':function() {
           $('.flyFormInput.' + this._id).css({display: 'inline-block'});
           $('.buttons.' + this._id).css({display: 'block'});
           $('.' + this._id + ' .flyGoalName').css({display: 'none'});
           $('.' + this._id + ' .flyGoalDescription').css({display: 'none'});
        }, 
        'click #goalLineRight':function() {
            console.log('goalineright clicked');
            Meteor.call('removeInitGoal', "initialDate");
        }

    });
}

if(Meteor.isServer) {

    Meteor.methods({
        addGoal:function(goalName, goalDescription, goalDate, goalTotalDay, intialName, currentTotalDay){
            goals.insert({
                initialName: intialName,
                goalName: goalName, 
                goalDescription: goalDescription,
                goalDate: goalDate,
                goalYear: goalDate.getFullYear(),
                goalMonth: goalDate.getMonth() + 1,
                goalDay: goalDate.getDate(),
                goalTotalDay: goalTotalDay,   
                goalDaysLeft: parseInt(goalTotalDay - currentTotalDay)
            });
        }, 
        addPlaceholder:function() {
            goals.insert({
                goalName: 'name here', 
                goalDescription: 'description',
                goalDate: goalDate,
                goalYear: goalDate.getFullYear(),
                goalMonth: goalDate.getMonth() + 1,
                goalDay: goalDate.getDate(),
                goalTotalDay: goalTotalDay
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
        updateGoal:function(currentID, goalName, goalDescription, goalDate, goalYear, goalMonth, goalDay, goalTotalDay, relativePosition) {
            goals.update({_id: currentID}, {$set: {
                goalName: goalName,
                goalDescription: goalDescription,
                goalDate: goalDate,
                goalYear: goalDate.getFullYear(),
                goalMonth: goalDate.getMonth() + 1, 
                goalDay: goalDate.getDate(), 
                goalTotalDay: goalTotalDay,
                relativePosition: relativePosition
            }})
        }
    });
}






























