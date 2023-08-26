const defaultStrokeColor = "black";
var focusState;
var colorScale, greyScale;
var transitionTime = 750;
var categorySelect = 0;
var gradient;
var categories = [ "by Race", "by Age", "by Education Level", "by Sex", "by Nativity Status", "by Employment Status", "by Disability Status"]
let colors = ["#B997C7" , "#824D99" , "#4E78C4" , "#57A2AC" , "#7EB875" , "#D0B541" , "#E67F33" , "#CE2220" , "#521A13"]

var toolTip;
var sections;
var iterator = 0;
var focusIndex;
var containsNaN;
var colorMin, colorMax;


//Team:
//this function will tell you what state to graph, the index of the state to graph, what category to graph
//see the print statement for example
//just put your function calls here to update the graph.
function graphState() {
    var index = 0;
    for(i = 0; i < 50; i++) {

        if(focusState) {
            if (focusState.properties.name === stateData[i].name)
                index = i;
        }
    }
    console.log("Graphing " + categories[categorySelect] + " for " + stateData[index].name + "in year " + yearSelection + ".");
    //TODO: Put call to regraph viz2 and viz3 here
    //Put your initial graph() in the dom of data on 66,67
    //try to give your objects .attr('class', 'className') so we aren't working over each other
    //i.e. lineSvg.selectAll('.className').style.......
    lineReGraph(index, categorySelect);
    if(focusState === null || focusState === undefined)
    {
        drawPicto();
    }
    else
    {
        pictoReGraph();
    }
}



//Map Stuff -- See Brandon if you need to alter/change -- Overtly Complicated
function drawMap() {
    var mapSvg = d3.select("#mapSVG");
    //remove everything on the svg
    mapSvg.selectAll('*').remove();
    toolTip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    //set the map projection info
    let projection = d3.geoAlbersUsa()
        .scale(1400) //1550
        .translate([+mapSvg.style('width').replace('px','') - 710,
            +mapSvg.style('height').replace('px','') - 350]);
    let path = d3.geoPath()
        .projection(projection);

    //color scale by extent
    yearSelection = document.getElementById("yearSelect").value;
    attributeSelection = document.getElementById("mapAttributeSelect").value;

    let colorMax = Number.MIN_VALUE;
    let colorMin = Number.MAX_VALUE;
    for(i = 0; i < 50;i++)
    {
        if(parseInt(stateData[i].percent[yearSelection][attributeSelection]) > parseInt(colorMax))
        {
            colorMax = stateData[i].percent[yearSelection][attributeSelection];
        }
        else if(stateData[i].percent[yearSelection][attributeSelection] < colorMin)
        {
            colorMin = stateData[i].percent[yearSelection][attributeSelection];
        }
    }

    //change color scale here

    colorScale = d3.scaleSequential(d3.interpolateSpectral).domain([colorMin,colorMax]);
    greyScale = d3.scaleSequential(d3.interpolateGreys).domain([colorMin,colorMax]);
    console.log("Attribute: "+ attributeSelection+ "\nYear: "+yearSelection+"\nMin: "+colorMin+"\nMax:"+ colorMax);

    //draw background
    mapSvg.append("rect")
        .attr('class', "background")
        .style('opacity', 1)
        .attr("width", 1420)
        .attr("height", 775)
        .style('fill', "#121212")
        .on("click", function(d)
        {
            focus(d,path);
        });
    //draw the map
    mapSvg.selectAll(".states")
        .data(mapData.features)
        .enter()
        .append("path")
        .attr('id', function(d, i){
            var stateName = stateData[i].name;
            stateName = stateName.replace(/\s/g, '');
            return stateName;
        })
        .attr('class', 'states')
        .attr("d", path)
        .style("stroke", defaultStrokeColor)
        .style("stroke-width", "1")
        .style("fill", function(d) {

            for(var i = 0;i < 50;i++)
            {
                if(d.properties.name == stateData[i].name)
                {
                   return colorScale(stateData[i].percent[yearSelection][attributeSelection]);
                }
            }
        })
        .on("mouseover", function(d) {
            //set stroke to hovered if not the selected state
            var state = d3.select(this);
            if(focusState === null || focusState === undefined) {
                state.style('stroke-width', '2')
                    .style('fill-opacity', .5)
                    .style('stroke-opacity', 1);
                var value;
                for(var i = 0; i < 50; i++)
                {
                    if(d.properties.name === stateData[i].name)
                    {
                        value = stateData[i].percent[yearSelection][attributeSelection];
                    }
                }
                    toolTip.style("opacity", .9);
                    toolTip.html(d.properties.name + "<br/>" + value + "%")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            }
            if(focusState)
            {
                var tempState = focusState.properties.name.replace(' ', '');
                if(this.id !== tempState)
                {
                    var index = 0;
                    for(i = 0; i < 50; i++)
                    {
                        var temp = stateData[i].name.replace(' ', '');
                        if(temp === this.id)
                        {
                            index = i;
                        }
                    }
                    state.style('fill', function(d)
                    {
                        return colorScale(stateData[index].percent[yearSelection][attributeSelection])
                    });
                    state.style('stroke-width', '1.25')
                        .style('fill-opacity', .5)
                        .style('stroke-opacity', 1);
                }
            }
        })
        .on('mouseout', function(d) {
            toolTip.style("opacity", 0);
            var state = d3.select(this);
            if(focusState === null || focusState === undefined) {
                state.style('stroke-width', '1')
                    .style('fill-opacity', 1)
                    .style('stroke-opacity', 1);
            }
            if(focusState)
            {
                var tempState = focusState.properties.name.replace(' ', '');
                if(this.id !== tempState)
                {
                    var index = 0;
                    for(i = 0; i < 50; i++)
                    {
                        var temp = stateData[i].name.replace(' ', '');
                        if(temp === this.id)
                        {
                            index = i;
                        }
                    }
                    state.style('fill', function(d)
                    {
                        return greyScale(stateData[index].percent[yearSelection][attributeSelection])
                    });
                    state.style('stroke-width', '1')
                        .style('fill-opacity', 1)
                        .style('stroke-opacity', 1);
                }
            }


        })
        .on('click', function(d) {
            focus(d, path); //ZOOM
        })
        .on('mousemove', function(d)
        {
            if(d === focusState)
            {
                pieChartToolTip(d);
            }
        });
    var zoomIconURL = [{url:"https://www.svgrepo.com/show/98454/close.svg"}]
    var images = mapSvg.selectAll(".images")
        .data(zoomIconURL)
        .enter()
        .append("image")
        .attr('class', 'zoomButton')
        .style('opacity', 0);

    images.attr("xlink:href", function(d){return d.url})
        .attr("x", 25)
        .attr("y", 25)
        .attr("width", 50)
        .attr("height", 50)
        .on("click", function(d)
        {
            focus(null, path);
        });
    var leftIconURL = [{url:"https://www.svgrepo.com/show/12253/left-chevron.svg"}]
    var left = mapSvg.selectAll(".left")
        .data(leftIconURL)
        .enter()
        .append("image")
        .attr('class', 'left')
        .style('opacity', 0);
    left.attr("xlink:href", function(d){return d.url})
        .attr("x", 25)
        .attr("y", 90)
        .attr("width", 50)
        .attr("height", 50)
        .on("click", function(d)
        {
            if(d3.select(this).style("opacity") === "1")
            {
                categorySelect--;
                if(categorySelect < 0)
                {
                    categorySelect = 6;
                }
                mapSvg.selectAll(".selector").text(categories[categorySelect]);
                updatePieChart();
                showStateStatistics(focusState);
            }
        });
    var rightIconURL = [{url:"https://www.svgrepo.com/show/39957/right-chevron.svg"}]
    var right = mapSvg.selectAll(".right")
        .data(rightIconURL)
        .enter()
        .append("image")
        .attr('class', 'right')
        .style('opacity', 0);
    right.attr("xlink:href", function(d){return d.url})
        .attr("x", 85)
        .attr("y", 90)
        .attr("width", 50)
        .attr("height", 50)
        .on("click", function(d) {
            if(d3.select(this).style("opacity") === "1")
            {
                categorySelect++;
                if(categorySelect > 6)
                {
                    categorySelect = 0;
                }
                mapSvg.selectAll(".selector").text(categories[categorySelect]);
                updatePieChart();
                showStateStatistics(focusState);
            }
        });



    mapSvg.append("text")
        .attr('class', 'titleLabel')
        .attr("font-size","40px")
        .attr("y", 70)
        .attr("x", "50%")
        .attr('text-anchor', 'start')
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Total Population below the National Poverty Line")
        .style("opacity", 1)

    mapSvg.append("text")
        .attr('class', 'stateLabel')
        .attr("font-size","60px")
        .attr("y", 70)
        .attr("x", 100)
        .attr('text-anchor', 'start')
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("font-weight", "bold")
        .text("WORDS")
        .style("opacity", 0)
        .on("click", function(d)
        {
            focus(null, path);
        })
    mapSvg.append("text")
        .attr('class', 'selector')
        .attr("font-size","32px")
        .attr("y", 125)
        .attr("x", 150)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '1')
        .style("font-weight", "bold")
        .text(categories[categorySelect])
        .style("opacity", 0)
        .on("click", function()
        {
            if(d3.select(this).style("opacity") === "1")
            {
                categorySelect++;
                if(categorySelect > 6)
                {
                    categorySelect = 0;
                }
                mapSvg.selectAll(".selector").text(categories[categorySelect]);
                updatePieChart();
                showStateStatistics(focusState);
            }
        })


    mapSvg.append("text")
        .attr('class', 'key1')
        .attr("font-size","25px")
        .attr("y", 170)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key2')
        .attr("font-size","25px")
        .attr("y", 200)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key3')
        .attr("font-size","25px")
        .attr("y", 230)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key4')
        .attr("font-size","25px")
        .attr("y", 260)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key5')
        .attr("font-size","25px")
        .attr("y", 290)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key6')
        .attr("font-size","25px")
        .attr("y", 320)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key7')
        .attr("font-size","25px")
        .attr("y", 350)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key8')
        .attr("font-size","25px")
        .attr("y", 380)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("text")
        .attr('class', 'key9')
        .attr("font-size","25px")
        .attr("y", 410)
        .attr("x", 70)
        .style("fill", "#FFFFFF")
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("font-weight", "bold")
        .text("")
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key1Square')
        .attr("y", 152)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[0])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key2Square')
        .attr("y", 182)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[1])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key3Square')
        .attr("y", 212)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[2])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key4Square')
        .attr("y", 242)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[3])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key5Square')
        .attr("y", 272)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[4])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key6Square')
        .attr("y", 302)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[5])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key7Square')
        .attr("y", 332)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[6])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key8Square')
        .attr("y", 362)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[7])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    mapSvg.append("rect")
        .attr('class', 'key9Square')
        .attr("y", 392)
        .attr("x", 45)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colors[8])
        .style("stroke", 'black')
        .style("stroke-width", '.75')
        .style("opacity", 0)
    var colorScaleKeyArray = Array.from(Array(100).keys());
    var colorScaleKey = d3.scaleSequential(d3.interpolateSpectral).domain([0,99]);
    var xScale = d3.scaleLinear()
        .domain([0,99])
        .range([0, 200]);

    var scaleLegend = mapSvg.selectAll(".keyLegend")
        .data(colorScaleKeyArray)
        .enter()
        .append("rect")
        .attr('class', 'keyLegend')
        .attr("x", function(d)
        {
            return Math.floor(xScale(d)) + 1150;
        })
        .attr("y", 650)
        .attr("height", 25)
        .attr("width", (d) => {
            if (d == 99) {
                return 6;
            }
            return Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1;
        })
        .attr("fill", (d) => colorScaleKey(d))



    var scale = d3.scaleLinear()
        .domain([colorMin/100, colorMax/100])
        .range([0, 205])
    var axis = d3.axisBottom(scale)
        .scale(scale)
        .tickSize(10)
        .ticks(3)
        .tickFormat(d3.format(".0%"));

    //var legendaxis = d3.axisRight().scale(scale).tickSize(6).ticks(8);
    mapSvg
        .append('svg:g')
        .attr("class", "axis")
        .style("font-size","15px")
        .attr(
            "transform",
            "translate(" +
            (1150) +
            "," +
            (675) +
            ")"
        )
        .call(axis);


}
function pieChartToolTip() {
    var mapSvg = d3.select("#mapSVG");//.node()
    var id = "#" + focusState.properties.name.replace(/\s/g, '');
    var state = d3.select(id);
    var height = state.node().getBoundingClientRect().height;
    var bottom = state.node().getBoundingClientRect().bottom;
    var top = state.node().getBoundingClientRect().top;
    var y = d3.event.pageY;
    if(sections) {
        for (i = 0; i < sections.length - 1; i++) {
            if (y > sections[i] && y < sections[i + 1]) {
                toolTip.style("opacity", .9);
                toolTip//.html(colors[i])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 50) + "px");
                switch(categorySelect)
                {
                    case 0:
                    {
                        switch(i)
                        {
                            case 0:
                            {
                                toolTip.html(
                                stateData[focusIndex].percent[yearSelection]["White"]
                                    + "% of White Identifying Individuals are in Poverty");
                                break;
                            }
                            case 1:
                            {
                                //White Alone, Not Hispanic
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["White alone, not Hispanic"]
                                    + "% of White alone, not Hispanic Identifying Individuals are in Poverty");
                                break;
                            }
                            case 2:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Hispanic/Latino"]
                                    + "% of Hispanic/Latino Identifying Individuals are in Poverty");
                                break;
                            }
                            case 3:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Black"]
                                    + "% of Black Identifying Individuals are in Poverty");
                                break;
                            }
                            case 4:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Asian"]
                                    + "% of Asian Identifying Individuals are in Poverty");
                                break;
                            }
                            case 5:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Native American"]
                                    + "% of Native American Identifying Individuals are in Poverty");
                                break;
                            }
                            case 6:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Pacific Islander"]
                                    + "% of Hawaiian/Other Pacific Islander Identifying Individuals are in Poverty");
                                break;
                            }
                            case 7:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Two or More"]
                                    + "% of Two or More Races Identifying Individuals are in Poverty");
                                break;
                            }
                            case 8:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Other"]
                                    + "% of Other Race Identifying Individuals are in Poverty");
                                break;
                            }
                        }
                        break;
                    }
                    case 1:
                    {
                        switch(i)
                        {
                            case 0:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Under 18"]
                                    + "% of Under Age 18 Individuals are in Poverty");
                                break;
                            }
                            case 1:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["18 to 64"]
                                    + "% of Age 18 to 64 Individuals are in Poverty");
                                break;
                            }
                            case 2:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["65 and up"]
                                    + "% of Age 65 and up Individuals are in Poverty");
                                break;
                            }
                        }
                        break;
                    }
                    case 2:
                    {
                        switch(i)
                        {
                            case 0:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["< High School"]
                                    + "% of Individuals with Less than High School Level of Education are in Poverty");
                                break;
                            }
                            case 1:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["High School"]
                                    + "% of Individuals with High School Level or Equivalent Level of Education are in Poverty");
                                break;
                            }
                            case 2:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Some College"]
                                    + "% of Individuals with Some College Level of Education are in Poverty");
                                break;
                            }
                            case 3:
                            {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection][">= Bachelor"]
                                    + "% of Individuals with Bachelor's or Higher Level of Education are in Poverty");
                                break;
                            }
                        }
                        break;
                    }
                    case 3:
                    {
                        switch(i) {
                            case 0: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Male"]
                                    + "% of Male Identifying Individuals are in Poverty");
                                break;
                            }
                            case 1: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Female"]
                                    + "% of Female Identifying Individuals are in Poverty");
                                break;
                            }
                        }
                        break;
                    }
                    case 4:
                    {
                        switch(i) {
                            case 0: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Native"]
                                    + "% of Native-Born Individuals are in Poverty");
                                break;
                            }
                            case 1: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Foreign born"]
                                    + "% of Foreign-Born Individuals are in Poverty");
                                break;
                            }
                        }
                        break;
                    }
                    case 5:
                    {
                        switch(i) {
                            case 0: {

                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Full-Time"]
                                    + "% of Full-Time Working Individuals are in Poverty");
                                break;
                            }
                            case 1: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Part-Time"]
                                    + "% of Part-Time Working Individuals are in Poverty");
                                break;
                            }
                            case 2: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["No Work"]
                                    + "% of Unemployed Individuals are in Poverty");
                                break;
                            }
                        }
                        break;
                    }
                    case 6:
                    {
                        switch(i) {
                            case 0: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["Disability"]
                                    + "% of Individuals Identifying with One or More Disability are in Poverty");
                                break;

                            }
                            case 1: {
                                toolTip.html(
                                    stateData[focusIndex].percent[yearSelection]["No Disability"]
                                    + "% of Individuals Identifying with No Disabilities are in Poverty");
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            else
            {
                if(containsNaN)
                {
                    toolTip.style("opacity", .9);
                    toolTip
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 50) + "px");
                    toolTip.html(
                        "No Data Available for Disability in " + yearSelection);
                }
            }
        }
    }
}
function calculateToolTip() {
    if (iterator < 50)
    {
        iterator++
    }
    if( iterator === 50 && focusState) {
        var yReset = window.pageYOffset
        window.scrollTo(0, 0);
        iterator = 0;
        var id = "#" + focusState.properties.name.replace(/\s/g, '');
        var state = d3.select(id);
        var height = state.node().getBoundingClientRect().height;
        var top = state.node().getBoundingClientRect().top;
        sections = offset;
        for (var i = 0; i < sections.length; i++) {
            sections[i] = sections[i].toString().replace("%", "");
            sections[i] = parseFloat(sections[i]);
            sections[i] = sections[i] * (1 / 100)
            sections[i] = sections[i] * height + top;
        }
        for(i = 0; i < 50; i++)
        {
            if(stateData[i].name === focusState.properties.name)
            {
                focusIndex = i;
            }
        }
            window.scrollTo(0, yReset);
    }
}
function changeMapAttribute(mapTitle) {
    var mapSvg = d3.select("#mapSVG");
    var transitionTime = 750;

    mapSvg.selectAll('.titleLabel')
        .text(mapTitle)
    mapSvg.selectAll('.states')
        .transition()
        .duration(transitionTime)
        .style("fill", function(d, i) {
            if(focusState === undefined || focusState === null)
            {
                if (d.properties.name === stateData[i].name) {
                    return colorScale(stateData[i].percent[yearSelection][attributeSelection]);
                }
            }
            else {
                if (d.properties.name === stateData[i].name)
                {
                    if(d === focusState)
                    {
                        return pieChart();
                    }
                    return greyScale(stateData[i].percent[yearSelection][attributeSelection]);
                }
            }
        })
        .on("end", calculateToolTip);
}
function showStateStatistics(state) {
    graphState();
    toolTip.style("opacity", 0);
    hideStateStatistics();
    var temp = "#" + focusState.properties.name.replace(' ', '');
    var focus = d3.select(temp);
    focus.style('fill-opacity', 1);

    var mapSvg = d3.select("#mapSVG")
    mapSvg.selectAll('.axis')
        .style('opacity', 0)
    mapSvg.selectAll('.stateLabel')
        .text("Poverty in " + state.properties.name)
        .style('opacity', 1)
    mapSvg.selectAll('.selector')
        .style('opacity',1)
    mapSvg.selectAll('.left')
        .style('opacity',1)
    mapSvg.selectAll('.right')
        .style('opacity',1)
    mapSvg.selectAll('.titleLabel')
        .style('opacity',0)
        .attr("y", -1000)
        .attr("x", -1000)
    mapSvg.selectAll('.keyLegend')
        .style('opacity', 0)
    switch(categorySelect)
    {
        //"Race"
        case 0:
        {
            mapSvg.selectAll('.key1').text("White").style('opacity', 1)
            mapSvg.selectAll('.key2').text("White alone, not Hispanic").style('opacity', 1)
            mapSvg.selectAll('.key3').text("Hispanic/Latino").style('opacity', 1)
            mapSvg.selectAll('.key4').text("Black").style('opacity', 1)
            mapSvg.selectAll('.key5').text("Asian").style('opacity', 1)
            mapSvg.selectAll('.key6').text("Native American").style('opacity', 1)
            mapSvg.selectAll('.key7').text("Pacific Islander").style('opacity', 1)
            mapSvg.selectAll('.key8').text("Two or More").style('opacity', 1)
            mapSvg.selectAll('.key9').text("Other").style('opacity', 1)

            mapSvg.selectAll('.key1Square').style('opacity', 1)
            mapSvg.selectAll('.key2Square').style('opacity', 1)
            mapSvg.selectAll('.key3Square').style('opacity', 1)
            mapSvg.selectAll('.key4Square').style('opacity', 1)
            mapSvg.selectAll('.key5Square').style('opacity', 1)
            mapSvg.selectAll('.key6Square').style('opacity', 1)
            mapSvg.selectAll('.key7Square').style('opacity', 1)
            mapSvg.selectAll('.key8Square').style('opacity', 1)
            mapSvg.selectAll('.key9Square').style('opacity', 1)
            break;
        }
        //"Age"
        case 1:
        {
            mapSvg.selectAll('.key1').text("Under 18").style('opacity', 1)
            mapSvg.selectAll('.key2').text("18 to 64").style('opacity', 1)
            mapSvg.selectAll('.key3').text("65 and Older").style('opacity', 1)
            mapSvg.selectAll('.key1Square').style('opacity', 1)
            mapSvg.selectAll('.key2Square').style('opacity', 1)
            mapSvg.selectAll('.key3Square').style('opacity', 1)
            break;
        }
        //"Education"
        case 2:
        {
            mapSvg.selectAll('.key1').text("Less than High School").style('opacity', 1)
            mapSvg.selectAll('.key2').text("High School or Equivalent").style('opacity', 1)
            mapSvg.selectAll('.key3').text("Some College").style('opacity', 1)
            mapSvg.selectAll('.key4').text("Bachelor's or Above").style('opacity', 1)
            mapSvg.selectAll('.key1Square').style('opacity', 1)
            mapSvg.selectAll('.key2Square').style('opacity', 1)
            mapSvg.selectAll('.key3Square').style('opacity', 1)
            mapSvg.selectAll('.key4Square').style('opacity', 1)
            break;
        }
        //"Sex"
        case 3:
        {
            mapSvg.selectAll('.key1').text("Male").style('opacity', 1)
            mapSvg.selectAll('.key2').text("Female").style('opacity', 1)
            mapSvg.selectAll('.key1Square').style('opacity', 1)
            mapSvg.selectAll('.key2Square').style('opacity', 1)
            break;
        }
        //"Nativity"
        case 4:
        {
            mapSvg.selectAll('.key1').text("Native").style('opacity', 1)
            mapSvg.selectAll('.key2').text("Foreign-born").style('opacity', 1)
            mapSvg.selectAll('.key1Square').style('opacity', 1)
            mapSvg.selectAll('.key2Square').style('opacity', 1)
            break;
        }
        //Work Status
        case 5:
        {
            mapSvg.selectAll('.key1').text("Full-Time").style('opacity', 1)
            mapSvg.selectAll('.key2').text("Part-Time").style('opacity', 1)
            mapSvg.selectAll('.key3').text("No Work").style('opacity', 1)
            mapSvg.selectAll('.key1Square').style('opacity', 1)
            mapSvg.selectAll('.key2Square').style('opacity', 1)
            mapSvg.selectAll('.key3Square').style('opacity', 1)
            break;
        }
        //Disability
        case 6:
        {
            mapSvg.selectAll('.key1').text("Disability").style('opacity', 1)
            mapSvg.selectAll('.key2').text("No Disability").style('opacity', 1)
            mapSvg.selectAll('.key1Square').style('opacity', 1)
            mapSvg.selectAll('.key2Square').style('opacity', 1)
            break;
        }
    }
}
function hideStateStatistics() {
    var mapSvg = d3.select("#mapSVG");
    if(!focusState) {
        mapSvg.selectAll('.titleLabel')
            .style('opacity', 1)
            .attr("y", 70)
            .attr("x", "50%")
        mapSvg.selectAll('.keyLegend')
            .style('opacity', 1)
        mapSvg.selectAll('.axis')
            .style('opacity', 1)
    }
    mapSvg.selectAll('.stateLabel')
        .style('opacity', 0)
    mapSvg.selectAll('.selector')
        .style('opacity',0)
    mapSvg.selectAll('.left')
        .style('opacity',0)
    mapSvg.selectAll('.right')
        .style('opacity',0)
    mapSvg.selectAll('.key1').style('opacity', 0)
    mapSvg.selectAll('.key2').style('opacity', 0)
    mapSvg.selectAll('.key3').style('opacity', 0)
    mapSvg.selectAll('.key4').style('opacity', 0)
    mapSvg.selectAll('.key5').style('opacity', 0)
    mapSvg.selectAll('.key6').style('opacity', 0)
    mapSvg.selectAll('.key7').style('opacity', 0)
    mapSvg.selectAll('.key8').style('opacity', 0)
    mapSvg.selectAll('.key9').style('opacity', 0)
    mapSvg.selectAll('.key1Square').style('opacity', 0)
    mapSvg.selectAll('.key2Square').style('opacity', 0)
    mapSvg.selectAll('.key3Square').style('opacity', 0)
    mapSvg.selectAll('.key4Square').style('opacity', 0)
    mapSvg.selectAll('.key5Square').style('opacity', 0)
    mapSvg.selectAll('.key6Square').style('opacity', 0)
    mapSvg.selectAll('.key7Square').style('opacity', 0)
    mapSvg.selectAll('.key8Square').style('opacity', 0)
    mapSvg.selectAll('.key9Square').style('opacity', 0)
    toolTip.style('opacity', 0)
}
function calculateZoom(stateName) {
    switch(stateName) {
        case "Alabama":
            return 5.5;
        case "Alaska":
            return 4;
        case "Arizona":
            return 4.25;
        case "Arkansas":
            return 6;
        case "California":
            return 2;
        case "Colorado":
            return 4.5;
        case "Connecticut":
            return 18;
        case "Delaware":
            return 15;
        case "Florida":
            return 3.75;
        case "Georgia":
            return 5;
        case "Hawaii":
            return 5;
        case "Idaho":
            return 2.8;
        case "Illinois":
            return 4.25;
        case "Indiana":
            return 6.25;
        case "Iowa":
            return 6;
        case "Kansas":
            return 5.5;
        case "Kentucky":
            return 5.5;
        case "Louisiana":
            return 5.5;
        case "Maine":
            return 5.5;
        case "Maryland":
            return 9;
        case "Massachusetts":
            return 10;
        case "Michigan":
            return 4;
        case "Minnesota":
            return 4;
        case "Mississippi":
            return 5;
        case "Missouri":
            return 4.5;
        case "Montana":
            return 3.5;
        case "Nebraska":
            return 4.25;
        case "Nevada":
            return 3;
        case "New Hampshire":
            return 7.5;
        case "New Jersey":
            return 10;
        case "New Mexico":
            return 4;
        case "New York":
            return 5.75;
        case "North Carolina":
            return 6;
        case "North Dakota":
            return 6;
        case "Ohio":
            return 7;
        case "Oklahoma":
            return 4;
        case "Oregon":
            return 4.25;
        case "Pennsylvania":
            return 7;
        case "Rhode Island":
            return 20;
        case "South Carolina":
            return 7;
        case "South Dakota":
            return 5;
        case "Tennessee":
            return 6;
        case "Texas":
            return 2.25;
        case "Utah":
            return 4.5;
        case "Vermont":
            return 9;
        case "Virginia":
            return 6;
        case "Washington":
            return 5;
        case "West Virginia":
            return 6;
        case "Wisconsin":
            return 5.5;
        case "Wyoming":
            return 4.5;
    }
}
function showZoomOut() {
    var mapSvg = d3.select("#mapSVG");
    var images = mapSvg.selectAll(".zoomButton");
    images.style('opacity', 1);
}
function removeZoomOut() {
    var mapSvg = d3.select("#mapSVG");
    var images = mapSvg.selectAll(".zoomButton");
    images.style('opacity', 0);
    drawPicto();
}
function focus(stateObject, path) {
    var mapSvg = d3.select("#mapSVG");
    var horizontalOffset, verticalOffset, scaleChange;
    if (stateObject && focusState !== stateObject) {
        var centerCalculation = path.centroid(stateObject);
        horizontalOffset = centerCalculation[0];
        verticalOffset = centerCalculation[1];
        scaleChange = calculateZoom(stateObject.properties.name);
        focusState = stateObject;
        showZoomOut();
        showStateStatistics(stateObject);

    } else {
        horizontalOffset = 1440 / 2;
        verticalOffset = 760 / 2;
        scaleChange = 1;
        focusState = null;
        mapSvg.selectAll(".states")
            .style("opacity", 1);
        removeZoomOut();
        hideStateStatistics();
    }
    mapSvg.selectAll(".states")
        .classed("active", focusState && function (stateObject) {
            return stateObject === focusState;
        });
    mapSvg.selectAll('.states')
        .transition()
        .duration(transitionTime)
        .style("fill", function(d, i) {
                if (focusState !== undefined && focusState !== null) {
                    if(d === focusState)
                    {
                        return pieChart();
                    }
                    return greyScale(stateData[i].percent[yearSelection][attributeSelection]);
                } else {
                    return colorScale(stateData[i].percent[yearSelection][attributeSelection]);
                }
        })
        .attr("transform", "translate(" + 1440 / 2 + "," + 760 / 2 + ")" +
            "scale(" + scaleChange + ")" +
            "translate(" + -horizontalOffset + "," + -verticalOffset + ")")
        .style("stroke-width", 1.5 / scaleChange + "px")
        .on("end", calculateToolTip)
}
function pieChart() {
    var mapSvg = d3.select("#mapSVG");
    if(gradient)
    {
        gradient.remove();
    }
    let numbers;//populate value from the database
    containsNaN = false;
    for (var i = 0; i < 50; i++) {
        if (stateData[i].name === focusState.properties.name) {
            //race
            switch (categorySelect) {
                //"Race"
                case 0: {
                    numbers = Array(9)
                    numbers[0] = stateData[i].percent[yearSelection]["White"];
                    numbers[1] = stateData[i].percent[yearSelection]["White alone, not Hispanic"];
                    numbers[2] = stateData[i].percent[yearSelection]["Hispanic/Latino"];
                    numbers[3] = stateData[i].percent[yearSelection]["Black"];
                    numbers[4] = stateData[i].percent[yearSelection]["Asian"];
                    numbers[5] = stateData[i].percent[yearSelection]["Native American"];
                    numbers[6] = stateData[i].percent[yearSelection]["Pacific Islander"];
                    numbers[7] = stateData[i].percent[yearSelection]["Two or More"];
                    numbers[8] = stateData[i].percent[yearSelection]["Other"];
                    break;
                }
                // "Age"
                case 1: {
                    numbers = Array(3)
                    numbers[0] = stateData[i].percent[yearSelection]["Under 18"];
                    numbers[1] = stateData[i].percent[yearSelection]["18 to 64"];
                    numbers[2] = stateData[i].percent[yearSelection]["65 and up"];
                    break;
                }
                //"Education"
                case 2: {
                    numbers = Array(4)
                    numbers[0] = stateData[i].percent[yearSelection]["< High School"];
                    numbers[1] = stateData[i].percent[yearSelection]["High School"];
                    numbers[2] = stateData[i].percent[yearSelection]["Some College"];
                    numbers[3] = stateData[i].percent[yearSelection][">= Bachelor"];
                    break;
                }
                //"Sex"
                case 3: {
                    numbers = Array(2)
                    numbers[0] = stateData[i].percent[yearSelection]["Male"];
                    numbers[1] = stateData[i].percent[yearSelection]["Female"];
                    break;
                }
                //"Nativity"
                case 4: {
                    numbers = Array(2)
                    numbers[0] = stateData[i].percent[yearSelection]["Native"];
                    numbers[1] = stateData[i].percent[yearSelection]["Foreign born"];
                    break;
                }
                //"Disability"
                case 5: {
                    numbers = Array(3)
                    numbers[0] = stateData[i].percent[yearSelection]["Full-Time"];
                    numbers[1] = stateData[i].percent[yearSelection]["Part-Time"];
                    numbers[2] = stateData[i].percent[yearSelection]["No Work"];
                    break;
                }
                //"Work Status"
                case 6: {
                    numbers = Array(2)
                    numbers[0] = stateData[i].percent[yearSelection]["Disability"];
                    numbers[1] = stateData[i].percent[yearSelection]["No Disability"];
                    break;
                }
            }
        }
    }

    for (let i = 0; i < numbers.length; i++) {
        numbers[i] = parseInt(numbers[i]);
        if (isNaN(numbers[i])) {
            containsNaN = true;
        }
    }
    if (containsNaN) {
        return "white";
    } else {
        let lambda = 100 / (numbers.reduce((partial_sum, a) => partial_sum + a, 0));
        var grad = mapSvg.append("defs")
            .append("linearGradient")
            .attr("id", "grad")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        offset = Array(numbers.length + 1);
        offset[0] = "0%";
        var temp = 0;

        for (i = 0; i < numbers.length; i++) {
            temp += numbers[i] * lambda;
            offset[i + 1] = temp + "%";
        }

        for (i = 0; i < offset.length; i++) {
            grad.append("stop").attr("offset", offset[i]).style("stop-color", colors[i]).style("stop-opacity", 1)
            grad.append("stop").attr("offset", offset[i + 1]).style("stop-color", colors[i]).style("stop-opacity", 1)
        }
        gradient = grad;
        return "url(#grad)";
    }
}
function updatePieChart() {
    var mapSvg = d3.select("#mapSVG");
    gradient.remove();
    mapSvg.selectAll(".states")
        .style("fill", function(d, i) {
            if(d === focusState)
            {
                return pieChart();
            }
            return greyScale(stateData[i].percent[yearSelection][attributeSelection]);
        })
    iterator = 50;
    calculateToolTip();
}



//end of Map Stuff -- See Brandon if you need to alter/change -- Overtly Complicated


