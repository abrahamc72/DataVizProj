//put the third viz code here
//todo:
//on a function call from graphState() in map.js, regraph to the state category parameters. see map.js for function call parameters
//Display alabama first with race category on startup;
//use stateData[i].population (not yet implemented), use .percentage for now I guess;

//put the third viz code here
//todo:
//on a function call from graphState() in map.js, regraph to the state category parameters. see map.js for function call parameters
//Display alabama first with race category on startup;
//use stateData[i].population (not yet implemented), use .percentage for now I guess;

var pictoNum;
var realNum;


//used when leaving zoom and initial load
function drawPicto()
{

    //select svg
    var pictoSvg = d3.select("#uniqueSVG");
    pictoSvg.selectAll('*').remove();

    //background
    pictoSvg.append("rect")
        .attr('class', "background")
        .style('opacity', 1)
        .attr("width", 1420)
        .attr("height", 775)
        .attr("x","-100")
        .style('fill', "#ebd5b3");
    //title element
    pictoSvg.append("text")
            .attr("font-size","7px")
            .attr("y", 8)
            .attr("x", "50%")
            .attr("fill","white")
            .attr('text-anchor', 'start')
            .style("font-family","Arial")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("stroke","black")
            .style("stroke-width", "0.2")
            .text("Enter State View to View Pictograph")
            .style("opacity", 1);
        
            
    //create space for picto
    pictoSvg.attr("viewBox","0 0 100 100");

    var colNum = 1;
    var rowNum = 9;

    
    //padding for each picto
    var XgridPad = -60;
    var YgridPad = 20;

    var hIconSpace = 9;
    var vIconSpace = 8;

    var defaultGrid=d3.range(colNum*rowNum);

    //create the icon
    pictoSvg.append("defs")
                .append("g")
                .attr("id","pictoIcon")
                .append("path")
                .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");
    //create the half icon           
    pictoSvg.append("defs")
        .append("g")
        .attr("id","pictoIconHalf")
        .append("path")
        .attr("d","M 3.5 2 H 2.7 C 3 1.8 3.3 1.5 3.3 1.1 c 0 -0.6 -0.4 -1 -1 -1 c -0.6 0 -1 0.4 -1 1 c 0 0.4 0.2 0.7 0.6 0.9 H 1.1 C 0.7 2 0.4 2.3 0.4 2.6 v 1.9 h 0.2 h 1.4 h 2 C 4 2 3.8 2 3.5 2 z");
    //legend text
        pictoSvg.append("text")
        .attr("font-size","5px")
        .attr("id","Legend1")
        .attr("y", 70)
        .attr("x", 160)
        .attr("fill","white")
        .attr('text-anchor', 'start')
        .style("font-family","Arial")
        .style("font-weight", "bold")
        .style("stroke","black")
        .style("stroke-width", "0.2")
        .style("text-anchor", "middle")
        .text(" <100k")
        .style("opacity", 1);

        pictoSvg.append("text")
        .attr("font-size","5px")
        .attr("id","Legend2")
        .attr("y", 60)
        .attr("x", 161)
        .attr("fill","white")
        .attr('text-anchor', 'start')
        .style("font-family","Arial")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("stroke","black")
        .style("stroke-width", "0.2")
        .text("100k")
        .style("opacity", 1);

        //legend icons
        pictoSvg.append("g")
        .append("use")
        .attr("xlink:href","#pictoIcon")
        .attr("x",148)
        .attr("y",53)
        .classed("iconFillLegend",true);

        pictoSvg.append("g")
        .append("use")
        .attr("xlink:href","#pictoIconHalf")
        .attr("x",148)
        .attr("y",66)
        .classed("iconFillLegend",true);
               
    //create no state selected picto
    pictoSvg.append("g")
        .attr("id","pictoLayer")
        .selectAll("use")
        .data(defaultGrid)
        .enter()
        .append("use")
            .attr("xlink:href","#pictoIcon")
            .attr("id",function(d)    {
                return d;
            })
            .attr("x",function(d) {
                var remainder=d % colNum;//calculates the x position (column number) using modulus
                return XgridPad+(remainder*vIconSpace);//apply the buffer and return value
            })
            .attr("y",function(d) {
                var whole=Math.floor(d/colNum)//calculates the y position (row number)
                return YgridPad+(whole*hIconSpace);//apply the buffer and return the value
            })
            .classed("iconFillLegend",true)
            .transition();

            

 }  

//used every update
function pictoReGraph()
{
    //select svg
    var pictoSvg = d3.select("#uniqueSVG");
    pictoSvg.selectAll('*').remove();
    //background
    pictoSvg.append("rect")
        .attr('class', "background")
        .style('opacity', 1)
        .attr("width", 1420)
        .attr("height", 775)
        .attr("x","-100")
        .style('fill', "#ebd5b3");
        //title
        pictoSvg.append("text")
        .attr("font-size","7px")
        .attr("id","pictoHeader")
        .attr("y", 8)
        .attr("x", "50%")
        .attr("fill","white")
        .attr('text-anchor', 'start')
        .style("font-family","Arial")
        .style("font-weight", "bold")
        .style("stroke","black")
        .style("stroke-width", "0.2")
        .style("text-anchor", "middle")
        .text("Enter State View to View Pictograph")
        .style("opacity", 1);

    var pictoTooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    pictoSvg.attr("viewBox","0 0 100 100");

    var colNum = 40;
    var rowNum = 1;
    var catNum = 9;

    switch (categorySelect) {
        //"Race"
        case 0: 
            {
                catNum = 9;
                break;
            }
        // "Age"
        case 1: {
            catNum=3;
            break;
        }
        //"Education"
        case 2: {
            catNum = 4;
            break;
        }
        //"Sex"
        case 3: {
            catNum = 2;
            break;
        }
        //"Nativity"
        case 4: {
            catNum = 2;
            break;
        }
        //"Disability"
        case 5: {
            catNum = 3;
            break;
        }
        //"Work Status"
        case 6: {
            catNum = 2;
            break;
        }
    }

    //padding for picto
    var XgridPad = -60;
    var YgridPad = 12;

    var hIconSpace = 20;
    var vIconSpace = 5;

    var myIndex=d3.range(colNum*rowNum);

    //create the icon
    pictoSvg.append("defs")
                .append("g")
                .attr("id","pictoIcon")
                .append("path")
                .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");
   
    pictoSvg.append("defs")
        .append("g")
        .attr("id","pictoIconHalf")
        .append("path")
        .attr("d","M 3.5 2 H 2.7 C 3 1.8 3.3 1.5 3.3 1.1 c 0 -0.6 -0.4 -1 -1 -1 c -0.6 0 -1 0.4 -1 1 c 0 0.4 0.2 0.7 0.6 0.9 H 1.1 C 0.7 2 0.4 2.3 0.4 2.6 v 1.9 h 0.2 h 1.4 h 2 C 4 2 3.8 2 3.5 2 z");
    
        //legend
        pictoSvg.append("text")
        .attr("font-size","5px")
        .attr("id","Legend1")
        .attr("y", 70)
        .attr("x", 160)
        .attr("fill","white")
        .attr('text-anchor', 'start')
        .style("font-family","Arial")
        .style("font-weight", "bold")
        .style("stroke","black")
        .style("stroke-width", "0.2")
        .style("text-anchor", "middle")
        .text(" <100k")
        .style("opacity", 1);

        pictoSvg.append("text")
        .attr("font-size","5px")
        .attr("id","Legend2")
        .attr("y", 60)
        .attr("x", 161)
        .attr("fill","white")
        .attr('text-anchor', 'start')
        .style("font-family","Arial")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("stroke","black")
        .style("stroke-width", "0.2")
        .text("100k")
        .style("opacity", 1);

        pictoSvg.append("g")
        .append("use")
        .attr("xlink:href","#pictoIcon")
        .attr("x",148)
        .attr("y",53)
        .classed("iconFillLegend",true);

        pictoSvg.append("g")
        .append("use")
        .attr("xlink:href","#pictoIconHalf")
        .attr("x",148)
        .attr("y",66)
        .classed("iconFillLegend",true);
    
    
    
            var newTitle = "";
            let numbers;
            //this loop grabs values and creates the title
            for (var i = 0; i < 50; i++) {
                if (stateData[i].name === focusState.properties.name) {
                    //race
                    switch (categorySelect) {
                        //"Race"
                        case 0: {
                            numbers = Array(9)
                            numbers[0] = stateData[i].population[yearSelection]["White"];
                            numbers[1] = stateData[i].population[yearSelection]["White alone, not Hispanic"];
                            numbers[2] = stateData[i].population[yearSelection]["Hispanic/Latino"];
                            numbers[3] = stateData[i].population[yearSelection]["Black"];
                            numbers[4] = stateData[i].population[yearSelection]["Asian"];
                            numbers[5] = stateData[i].population[yearSelection]["Native American"];
                            numbers[6] = stateData[i].population[yearSelection]["Pacific Islander"];
                            numbers[7] = stateData[i].population[yearSelection]["Two or More"];
                            numbers[8] = stateData[i].population[yearSelection]["Other"];

                            newTitle = "Total Population in Poverty in ";
                            newTitle += focusState.properties.name;
                            newTitle += " in ";
                            newTitle += yearSelection;
                            newTitle += " by Race"
                            document.getElementById("pictoHeader").innerHTML = newTitle;

                            break;
                        }
                        // "Age"
                        case 1: {
                            numbers = Array(3)
                            numbers[0] = stateData[i].population[yearSelection]["Under 18"];
                            numbers[1] = stateData[i].population[yearSelection]["18 to 64"];
                            numbers[2] = stateData[i].population[yearSelection]["65 and up"];

                            newTitle = "Population in Poverty in ";
                            newTitle += focusState.properties.name;
                            newTitle += " in ";
                            newTitle += yearSelection;
                            newTitle += " by Age";
                            document.getElementById("pictoHeader").innerHTML = newTitle;

                            break;
                        }
                        //"Education"
                        case 2: {
                            numbers = Array(4)
                            numbers[0] = stateData[i].population[yearSelection]["< High School"];
                            numbers[1] = stateData[i].population[yearSelection]["High School"];
                            numbers[2] = stateData[i].population[yearSelection]["Some College"];
                            numbers[3] = stateData[i].population[yearSelection][">= Bachelor"];

                            newTitle = "Population in Poverty in ";
                            newTitle += focusState.properties.name;
                            newTitle += " in ";
                            newTitle += yearSelection;
                            newTitle += " by Education Level";
                            document.getElementById("pictoHeader").innerHTML = newTitle;

                            break;
                        }
                        //"Sex"
                        case 3: {
                            numbers = Array(2)
                            numbers[0] = stateData[i].population[yearSelection]["Male"];
                            numbers[1] = stateData[i].population[yearSelection]["Female"];

                            newTitle = "Population in Poverty in ";
                            newTitle += focusState.properties.name;
                            newTitle += " in ";
                            newTitle += yearSelection;
                            newTitle += " by Sex";
                            document.getElementById("pictoHeader").innerHTML = newTitle;

                            break;
                        }
                        //"Nativity"
                        case 4: {
                            numbers = Array(2)
                            numbers[0] = stateData[i].population[yearSelection]["Native"];
                            numbers[1] = stateData[i].population[yearSelection]["Foreign born"];

                            newTitle = "Population in Poverty in ";
                            newTitle += focusState.properties.name;
                            newTitle += " in ";
                            newTitle += yearSelection;
                            newTitle += " by Nativity Status";
                            document.getElementById("pictoHeader").innerHTML = newTitle;

                            break;
                        }
                        //"Disability"
                        case 5: {
                            numbers = Array(3)
                            numbers[0] = stateData[i].population[yearSelection]["Full-Time"];
                            numbers[1] = stateData[i].population[yearSelection]["Part-Time"];
                            numbers[2] = stateData[i].population[yearSelection]["No Work"];

                            newTitle = "Population in Poverty in ";
                            newTitle += focusState.properties.name;
                            newTitle += " in ";
                            newTitle += yearSelection;
                            newTitle += " by Employment Status";
                            document.getElementById("pictoHeader").innerHTML = newTitle;
                            break;
                        }
                        //"Work Status"
                        case 6: {
                            numbers = Array(2)
                            numbers[0] = stateData[i].population[yearSelection]["Disability"];
                            numbers[1] = stateData[i].population[yearSelection]["No Disability"];

                            newTitle = "Population in Poverty in ";
                            newTitle += focusState.properties.name;
                            newTitle += " in ";
                            newTitle += yearSelection;
                            newTitle += " by Disability Status";
                            document.getElementById("pictoHeader").innerHTML = newTitle;

                            break;
                        }
                    }
                }
            }
            //make a copy of numbers and parse as int.
            

            var realValues = [];
            //divide by 100k to determine how many pics
            for (let i = 0; i < numbers.length; i++) 
            {
                realValues[i] = parseInt(numbers[i]);
                numbers[i] = Math.round(parseInt(numbers[i])/100000);
                if (isNaN(numbers[i])) {
                    numbers[i] = 0;
                }
            }
            
            
    var gap = 0;
    //for loop changes color and create the row for each attribute in that category
    for(i = 0;i<catNum;i++)
            {
                var colorselect;
                switch(i)
                {
                    case 0:{
                        colorselect = "iconFill1";break;
                        
                    }
                    case 1:{
                        
                        colorselect = "iconFill2";break;
                    }
                    case 2:{
                        
                        colorselect = "iconFill3";break;
                    }
                    case 3:{
                        
                        colorselect = "iconFill4";break;
                    }
                    case 4:{
                        
                        colorselect = "iconFill5";break;
                    }
                    case 5:{
                        
                        colorselect = "iconFill6";break;
                    }
                    case 6:{
                        colorselect = "iconFill7";break;
                    }
                    case 7:{
                        colorselect = "iconFill8";break;
                    }
                    case 8:
                    {
                        colorselect ="iconFill9";break;
                    }
                }
                //Pictos drawn here.
                var iconUse ="#pictoIcon";
                //if the value >100k use a half picto
                if(numbers[i]==0)
                {
                    iconUse = "#pictoIconHalf";
                }


                realNum = realValues[i];
                //draw
                var ptoolTipStr = "ptip";
                ptoolTipStr += i;
                ptoolTipStr = String(ptoolTipStr);
                pictoSvg.append("div")
                .attr("id",ptoolTipStr)
                .attr("class", "tooltip")
                .attr("value",realValues[i])
                .style("opacity", 1);
                var hashadd = "#";
                hashadd += ptoolTipStr;

                pictoSvg.append("g")
                .attr("id","pictoLayer"+i)
                .selectAll("use")
                .data(myIndex)
                .enter()
                .append("use")
                .attr("xlink:href",iconUse)
                .attr("id",function(d)    {
                     return "pictoID"+i;
                 })
                 .attr("x",function(d) {
                        if(numbers[i]==0)
                        {
                            return XgridPad;
                        }
                        else
                        {
                            var remainder=d % numbers[i];
                        }
                        return XgridPad+(remainder*vIconSpace);
                    })
                    .attr("y",function(d) {
                        var whole=Math.floor(d/colNum);
                        return YgridPad+gap+(whole*hIconSpace);
                    })
                    .classed(colorselect,true)
                    .on('mouseover', function(d) {

                        d3.select(this).transition()
                                 .attr('stroke-width', 4)
                                 .attr("stroke", "cyan");         
                        pictoTooltip.transition()
                          .duration(50)
                          .style("opacity", 1);
                        document.getElementById("ptip0").value;
                        //pictoTooltip.html('Value: ' + realNum)
                        //.style("left", (d3.event.pageX + 10) + "px")
                        //.style("top", (d3.event.pageY - 15) + "px");
                      })
                      .on('mouseout', function(d,i) {
                        d3.select(this).transition()
                                 .attr('opacity', '1')
                                 .attr('stroke-width', 1)
                                 .attr('stroke',"black");
                                 pictoTooltip.transition()
                                 .duration(50)
                                 .style("opacity", 0);
                      })
;

                    gap+=10;

            }
            
            

            
        




}
