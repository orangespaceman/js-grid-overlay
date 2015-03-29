/*
 * function to add a background grid/image to an html element on key presses
 * @author pete goodman - petegoodman.com
 */

var grid = {

    //set initial variable for whether the grid is currently shown
    gridVisible : false,

    //set variable to show whether the grid-containing element has had to be created
    gridElementCreated : false,

    //variables for the grid element
    gridHolder : {},
    gridSrc : "",
    gridPos : "",
    gridRepeat : "",


    /*
     * function to set the initial grid values
     * @param string gridElement the id or html tag to place the grid behind
     * @param string gridSrc the image source for the grid - relative to the html page
     * @param string gridPos the CSS positioning statement (eg 'left top', '50% 50%')
     * @param string gridRepeat the CSS repeat value (eg 'no-repeat','repeat-x','repeat-y')
     */
    init: function(gridElement, gridSrc, gridPos, gridRepeat) {

        //the html element holder, once we've found it
        this.gridHolder = this.getGridElement(gridElement);

        // if the function above doesn't find a grid element, then create a new element to hold it
        if (!this.gridHolder) {

            //get the body element
            var body = document.getElementsByTagName("body")[0];


            //create the new html element
            var overlay = document.createElement('div');
            overlay.id = gridElement;
            overlay.style.width = "100%";
            overlay.style.position = "absolute";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.zindex = "9999";
            overlay.style.display = "none";


            //for Win IE: set the height as the document height
            if (window.attachEvent) {
                overlay.style.height = document.body.offsetHeight;

            //for all other browsers, set element height at 100%
            } else {
                //overlay.style.minHeight = document.body.offsetHeight;
                overlay.style.height = "100%";
            }


            //add the new html element to the document
            body.appendChild(overlay);

            //set the element holder to the new element
            this.gridHolder = overlay;

            //set the variable telling the key checker that it applying to a new element
            this.gridElementCreated = true;
        };

        //if the function has found a grid element, set the root object variables
        this.gridSrc = gridSrc;
        this.gridPos = gridPos;
        this.gridRepeat = gridRepeat;

        //add the events
        this.addEvent(document, 'keydown', this.keyCheck, false);

    },


    /*
     * find the element that will contain the grid, by testing if its an id or tag
     * @param string gridElement the id or html tag to place the grid behind
     * @return object the html element in question
     */
    getGridElement: function(gridElement) {
        var el;

        //test if its an id
        el  = document.getElementById(gridElement);

        //if not, get the tag with the name
        if (!el) {
            el = document.getElementsByTagName(gridElement)[0];
        }
        return el;
    },


    /*
     * function to detect when the required keys are pressed, and act accordingly
     * @param event e the current window event
     */
    keyCheck: function(e) {

        //get the ids of which keys have been pressed
        var keyID = (window.event) ? event.keyCode : e.keyCode;
        var ctrlKey = (window.event) ? event.ctrlKey : e.ctrlKey;

        //alert(e.keyCode + ", " + e.ctrlKey);

        //test to see if its the selected keys
        //59 = win IE
        //186 = win FF & win Opera & mac Safari
        //90 = mac Opera
        if((keyID == 59 || keyID == 186 || keyID == 90)&&(ctrlKey == true))  {


            //if the bg is currently shown, remove it
            if (grid.gridVisible === true) {

                grid.gridHolder.style.backgroundImage = "none";

                //if the grid-containing element was created, set display to none so you can select items below
                if (grid.gridElementCreated === true) {
                    grid.gridHolder.style.display = "none";
                }

                grid.gridVisible = false;

            //else, the grid is hidden, so show it
            } else {

                grid.gridHolder.style.backgroundImage = "url('" + grid.gridSrc + "')";
                grid.gridHolder.style.backgroundPosition = grid.gridPos;
                grid.gridHolder.style.backgroundRepeat = grid.gridRepeat;

                //if the grid-containing element was created, display the image
                if (grid.gridElementCreated === true) {
                    grid.gridHolder.style.display = "block";
                }

                //set variable to show the grid is now shown
                grid.gridVisible = true;
            }
        }
    },


    /**
     * function to add event-listeners (cross-browser compatible)
     * By John Resig - http://ejohn.org/projects/flexible-javascript-events/
     *
     * @param obj object the html element object to attach the event to
     * @param type string the event type (e.g. 'load', 'keypress', 'click')
     * @param fn string the name of the function to call
     *
     * @return void
     */
    addEvent: function (obj, type, fn) {
        if (obj.attachEvent) {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
            obj.attachEvent('on'+type, obj[type+fn]);
        } else if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else {
            var oldfn = obj['on'+type];
            if (typeof obj['on'+type] != 'function') {
                 obj['on'+type] = fn;
            } else {
                 obj['on'+type] = function() {
                   oldfn();
                   fn();
                 };
            }
        }
     }
}