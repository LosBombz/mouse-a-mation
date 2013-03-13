(function($, document, undefined){
    'use strict';

    function getPanels (elem){
            
        // the stage element
        var $elem = elem;

        // array of jquery elements
        var panels = {};

        if ($elem === 'undefined') {
            App.log(2, 'Not A valid Stage Elem');
            return false;
        }

        // iterate over all the children of the stage container and push them
        // to the pannel array
        $elem.children().each(function(index, child){
            panels[index] = {
                id : index,
                el : child,
                $el : $(child)
            };
            

        });


        return panels;
    }

    /**
     * Function attached to jQuery function to start the parallax
     * 
     * @param  {object} o options to be merged with defaults
     * @return {object}   jquery selecter returned for chaining
     */
    $.fn.parallax = function(o){

        //cached jquery object for the parallax container
        var $stage = this;

        //array of jquery objects, these are the parallax layers
        var panels = Parallax.getPanels($stage);

        // default options

        /**
         * schema:
         * speed     {number} speed of the animation
         * yMotion   {bool}   enables y axis motion
         * panelOpts {array}  set options per panel
         *     |- height {number} simulate an elements height
         *     |- width  {number} simulate an elements width
         */
        var defaults = {

            //how far should elements animate
            speed: 50,

            //animate on y axis
            yMotion: false,

            //options per panel
            panelOpts: []

        };

        //merge options with defaults
        var options = _.extend({}, defaults, o);

        //if we're already parallaxing, don't do it again
        if($stage.data('parallax')){
            return false;
        }

        //add data to the stage object to flag parallax being active
        $stage.data('parallax', true);

        //merge panel options with the panels if they have been passed in
        if (options.panelOpts) {
            
            $.each(options.panelOpts, function(index, opts){
               
               $.extend(getPanel(index), opts);
            
            });
        }

        /**
         * function to get a specific panel
         * 
         * @param  {number} id the index of the panel
         * @return {object}    returns reference to the panel object
         */
        function getPanel( id ) {
            
            if( !panels[ id ] ){
                return false;
            }

            return panels[ id ];
        }


        /**
         * Internal function for creating parallax effect
         * 
         * @param  {object} e Mouse move event object
         * @return {undefined}   
         */
        function parallax( e ) {
            // Stages offset
            var offset = $(this).offset();

            //x position
            var xPos = e.pageX - offset.left;
            
            //yposition
            var yPos = e.pageY - offset.top;

            //percentage offset of mouse compared to the X edge of the container
            var mouseXpercent = Math.round(xPos / $(this).width() * 100);

            //percentage offset of mouse compared to the Y edge of the container
            var mouseYpercent = Math.round(yPos / $(this).height() * 100);

            
            // for each of the panels adjust the position based on the mouse position
            $.each(panels, function(index, panel){
                
                //the current panel
                var $panel = $(panel.el);

                // panel width is either elements width or a pseudo width passed in options
                var panelWidth = panel.width || $panel.width();

                // panel is either elements height or a pseudo height passed in options
                var panelHeight = panel.height || $panel.height();
                
                // X difference between panel and stage
                var diffX = $stage.width() - panelWidth;

                // X position based on the x difference and the percent position of the mouse
                var panelX = diffX * (mouseXpercent / 100);
                
                // if Y motion enabled set up the Y motion animation and data
                if (options.yMotion) {

                    // Y difference between panel and stage
                    var diffY = $stage.height() - panelHeight;
                    
                    // X position based on the x difference and the percent position of the mouse
                    var panelY = diffY * (mouseYpercent / 100);

                    // animate on both axis
                    $panel.animate({
                        left: panelX,
                        top: panelY
                    },
                    {
                        queue: false,
                        duration: options.speed,
                        easing: 'linear'
                    });
                } else {

                    // animate on X axis only
                    $panel.animate({
                        left: panelX
                    },
                    {
                        queue: false,
                        duration: options.speed,
                        easing: 'linear'
                    });
                }
            
            });

        }

        // bind mousemove to the parallax container
        $stage.on('mousemove', parallax);

        // returns the container jquery object for chaining
        return this;
    };


    /**
     * Function to remove parallax effect from stage
     * @return {object}   the container jquery object for chaining   
     * 
     * */
    $.fn.unparallax = function(){
        var $stage = this;
        
        // if the container isn't parallaxed return 
        if(!$stage.data('parallax')){
            return false;
        }

        // remove paralax flag from container
        $stage.data('parallax', false);

        // unbind mousemove
        $stage.off('mousemove');

        // returns the container jquery object for chaining
        return this;
    };
    
}(jQuery, document, undefined));