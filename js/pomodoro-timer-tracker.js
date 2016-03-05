/*
 * pomodoro-timer-tracking.js
 */

 var isTrackerDebug = false;

 $(document).ready(function() {
     initEventTrackers();
 });

 var initEventTrackers = function() {

     $(".pt-track-event").click(function(event) {

         var $this = $(this);

         if(isTrackerDebug) {
             console.log("pt-track-event event caught with data: "+JSON.stringify($this.data()));
         }

         var eventCategory = $this.data("eventCategory");
         var eventAction = $this.data("eventAction");
         var eventLabel = $this.data("eventLabel");
         var eventValue = $this.data("eventValue");

         // extract some addition info
         var eventData = {};
         eventData.type = event.type === undefined ? "" : event.type;
         eventData.id = $this.attr('id') === undefined ? "" : $this.attr('id');
         eventData.href = $this.attr('href') === undefined ? "" : $this.attr('href');
         eventData.title = $this.attr('title') === undefined ? "" : $this.attr('title');

         // send event to google analytics
         ga('ptlTracker.send', 'event', eventCategory, eventAction, eventLabel, eventValue, eventData);

         if($this.hasClass('pt-track-social')) {

             if(isTrackerDebug) {
                 console.log('pt-track-social enabled.');
             }

             var socialNetwork = $this.data("socialNetwork");
             var socialAction = $this.data("socialAction");
             var socialTarget = $this.data("socialTarget");

             ga('ptlTracker.send', 'social', socialNetwork, socialAction, socialTarget);
         }
     });
 };
