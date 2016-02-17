//d3.... a jagon is add a addtion d3 laberies  d3.custom = {} d3.custom.timeSeries()


d3.timeSeries = function(){
    //internal variables, these variables need some defualt variables which can be rewritten later
    var w =500,
        h =200,
        m ={t:50,r:25,b:50,l:25},
        // chartW = w - m.l- m.r,   // draw in small area than canvas
        // chartH = h - m.t -m.b,
        timeRange = [new Date(), new Date()],
        binSize,
        valueAccessor = function(d){return d}; // this equals what write in script.js function(d){return d.startTime} and then it will go to histogram layout
        //Constructs a new time scale with the default domain and range; the ticks and tick format are configured for local time.
        //domain value, according to the data y values


    //export part
    //this is the function in charge of transforming data and appending elements, add elements to visualization
function exports (selection){
//create a histogram layout
        chartW = w - m.l- m.r;   // draw in small area than canvas
        chartH = h - m.t -m.b;

var layout = d3.layout.histogram()
               .value(valueAccessor)
               .range(timeRange)
               .bins(binSize.range(timeRange[0],timeRange[1])); //d3.time.interval.range(date1,date2); go read d3.time.interval.range understand how this use

//take the data and use the histogram layout to transform into series of (x,y)
         selection.each(function(d){
         //selection in our case is d3.select('.plot') '_d' is data bond to the plot, 
         //this bonding step is before d3.selection.call(exports)function, 
         //therefore, we can console.log to see what's accually data are
            var data = layout(d);
            console.log(d);   //dx = binsize, x = startpoint, y = vaules(amount of trips)
            
            // append the dom element to data here is a empty div element, need to append <svg>, <g>, line<path> and area<path> <g.aixs>
            var scaleX = d3.time.scale().domain(timeRange).range([0,chartW]),
                scaleY = d3.scale.linear().domain([0,200]).range([chartH,0]);
           // !!!!!question! why my range of line and area will outof canvas
            // draw the (x,y) as a line and a area
            var line = d3.svg.line()
                         .x(function(d){ return scaleX(d.x.getTime()+ d.dx/2)})
                         .y(function(d){ return scaleY(d.y)})
                         .interpolate('basis');
            var area = d3.svg.area()
                         .x(function(d){return scaleX(d.x.getTime() + d.dx/2);})
                         .y0(chartH)
                         .y1(function(d){return scaleY(d.y);})
                         .interpolate('basis');
            // draw aixs 
             var axisX = d3.svg.axis()
                           .orient('bottom')
                           .scale(scaleX)
                           .ticks(d3.time.year);
              
            var axisY = d3.svg.axis()
                            .scale(scaleY)
                            .ticks(5)
                            .orient("right");
            
            //appand line, area, axisX to svg element
            var svg = d3.select(this)
                        .append('svg')  // d3.select(this) = each picked one in selection 
                        .attr('width',w)
                        .attr('height',h);// you need to append the w, h to the svg
                        
            svg
            .datum(data);

            svg.append('g')
               .attr("class","area")
               .attr("transform","translate("+m.l+","+m.t+")")
               .append("path")
               .attr("d",area);
            
            svg.append('g')
               .attr("class","line")
               .attr("transform","translate("+m.l+","+m.t+")")
               .append("path")
               .attr("d",line);
            
            svg.append('g').attr('class','axis').attr('transform','translate('+m.l+','+(m.t+chartH)+')').call(axisX);
            svg.append('g').attr('class','axis').attr('transform','translate('+m.l+','+m.t+')').call(axisY);

   

//example 1 
   /* var svg = d3.select(this).selectAll('svg')
                        .data([d]);

            var svgEnter = svg.enter().append('svg')
            svgEnter.append('g').attr('class','area').attr("transform","translate("+m.l+","+m.t+")").append('path');
            svgEnter.append('g').attr('class','line').attr("transform","translate("+m.l+","+m.t+")").append('path');
            svgEnter.append('g').attr('class','axisX').attr('transform','translate('+m.l+','+(m.t+chartH)+')');
           // svgEnter.append('g').attr('class','axisY').attr('transform','translate('+m.l+','+m.t+')');
            svg.attr('width',w).attr('height',h);

            svg.select('.line')
            .select('path')
            .datum(data)
            .attr('d',line);
        //2.2 area
        svg.select('.area')
            .select('path')
            .datum(data)
            .attr('d',area);
        //2.3 horizontal axis
        svg.select('.axisX')
            .call(axisX);

         svg.select('.axisY')
              .call(axisY);*/

});


}


    // getter and setter function which access the variables up to internal variables. 

exports.width = function(_x){  
if(!arguments.length) return w
   
   w = _x;
   return this;
}

exports.height = function(_h){
if(!arguments.length) return h
    
    h = _h;
    return this;
}
exports.value = function(_v){
if(!arguments.length) return valueAccessor

    valueAccessor = _v;
    return this;
}

exports.timeRange = function(_r){
    if(!arguments.length) return timeRange
       
      timeRange = _r;
      return this;
}
exports.binSize = function(_b){
if(!arguments.length) return binSize

    binSize = _b

    return this;
}



return exports
}