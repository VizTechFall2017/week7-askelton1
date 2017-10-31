var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

document.body.style.backgroundImage = "url('https://s-media-cache-ak0.pinimg.com/originals/7b/ef/15/7bef154dc7dd0cb3fdebaae1250ff2ce.jpg')";

var marginLeft = 100;
var marginTop = 100;

var nestedData = [];

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');


//these are the size that the axes will be on the screen; set the domain values after the data loads.
var scaleX = d3.scaleBand().rangeRound([0, width-2*marginLeft]).padding(0.3);
var scaleY = d3.scaleLinear().range([height-2*marginTop, 0]);
var scaleY2 = d3.scaleLinear().range([height-2*marginTop, 0]);

//import the data from the .csv file
d3.csv('./dataFinal.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == '2000'})[0].values;

    scaleX.domain(loadData.map(function(d){return d.state;}));
    scaleY.domain([1930, d3.max(loadData.map(function(d){return +d.dataMed}))]);

    // Add the x Axis
    svg.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX))
        .style('stroke','green')
        .style('line-color','white')
        .style('fill','green');

    svg.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY))
        .style('stroke','green')
        .style('line-color','white')
        .style('fill','green');

    svg.append('text')
        .text('Recreational Marijuana Laws Across the U.S.')
        .attr('transform','translate(150, -50)')
        .style('text-anchor','middle')
        .style('fill','green')
        .attr('font-size','18');

    svg.append('text')
        .text('State')
        .attr('transform','translate(0, 230)')
        .style('fill','green')
        .attr('font-size','14');

    svg.append('text')
        .text('Year')
        .attr('transform', 'translate(-40,200)rotate(270)')
        .style('fill','green')
        .attr('font-size','14');

///
    scaleY2.domain([1930, d3.max(loadData.map(function(d){return +d.dataRec}))]);

    svg2.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX))
        .style('stroke','green')
        .style('line-color','white')
        .style('fill','green');

    svg2.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY2))
        .style('stroke','green')
        .style('line-color','white')
        .style('fill','green');

    svg2.append('text')
        .text('Medicinal Marijuana Laws Across the U.S.')
        .attr('transform','translate(150, -50)')
        .style('text-anchor','middle')
        .style('fill','green')
        .attr('font-size','18');

    svg2.append('text')
        .text('State')
        .attr('transform','translate(0, 230)')
        .style('fill','green')
        .attr('font-size','14');

    svg2.append('text')
        .text('Year')
        .attr('transform', 'translate(-40,200)rotate(270)')
        .style('fill','green')
        .attr('font-size','14');


    //bind the data to the d3 selection, but don't draw it yet
    svg.selectAll('rect')
       .data(loadData, function(d){return d;});

    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(loadData);

});

//this function draws the actual data points as circles. It's split from the enter() command because we want to run it many times
//without adding more circles each time.
function drawPoints(pointData){

    scaleX.domain(pointData.map(function(d){return d.state;}));
    scaleY.domain([1930, d3.max(pointData.map(function(d){return +d.dataRec}))]);

    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY2));

    //select all bars in SVG1, and bind them to the new data
    var rects = svg.selectAll('.bars')
        .data(pointData, function(d){return d.dataRec;});

    //look to see if there are any old bars that don't have keys in the new data list, and remove them.
    rects.exit()
        .remove();

    //update the properties of the remaining bars (as before)
    rects
        .transition()
        .duration(200)
        .attr('x',function(d){
            return scaleX(d.state);
        })
        .attr('y',function(d){
            return scaleY(d.dataRec);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(d.dataRec);  //400 is the beginning domain value of the y axis, set above
        });

    //add the enter() function to make bars for any new countries in the list, and set their properties
    rects
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill', "green")
        .attr('x',function(d){
            return scaleX(d.state);
        })
        .attr('y',function(d){
            return scaleY(d.dataRec);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(d.dataRec);  //400 is the beginning domain value of the y axis, set above
        });

    //select all bars in SVG2, and bind them to the new data
    var rects2 = svg2.selectAll('.bars')
        .data(pointData, function(d){return d.state;});

    //look to see if there are any old bars that don't have keys in the new data list, and remove them.
    rects2.exit()
        .remove();

    //update the properties of the remaining bars (as before)
    rects2
        .transition()
        .duration(200)
        .attr('x',function(d){
            return scaleX(d.state);
        })
        .attr('y',function(d){
            return scaleY2(d.dataMed);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.dataMed);  //400 is the beginning domain value of the y axis, set above
        });

    //add the enter() function to make bars for any new countries in the list, and set their properties
    rects2
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill', "green")
        .attr('x',function(d){
            return scaleX(d.state);
        })
        .attr('y',function(d){
            return scaleY2(d.dataMed);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.dataMed);  //400 is the beginning domain value of the y axis, set above
        });



}


function updateData(state){
    return nestedData.filter(function(d){return d.key == state})[0].values;
}


//this function runs when the HTML slider is moved
function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}