//put the line chart d3 code here
//todo:
//on a function call from graphState() in map.js, regraph to the state category parameters. see map.js for function call parameters
//Display alabama first with race category on startup;
function lineReGraph(index = 0, categorySelect = 0) {
	var categories = [ " by Race", " by Age", " by Education Level", " by Sex", " by Nativity Status", " by Employment Status", " by Disability Status"];
	var colors = ["#B997C7" , "#824D99" , "#4E78C4" , "#57A2AC" , "#7EB875" , "#D0B541" , "#E67F33" , "#CE2220" , "#521A13"];
	var lineSvg = d3.select('#lineSVG');
	var lineWidth = +lineSvg.style('width').replace('px', '');
	var lineHeight = +lineSvg.style('height').replace('px', '');
	var lineMargin = {
		'left': 70,
		'right': 30,
		'top': 70,
		'bottom': 70
	};
	var lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
	var lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;

    lineSvg.append("rect")
        .attr('class', "background")
        .style('opacity', 1)
        .attr("width", 1420)
        .attr("height", 775)
        .style('fill', "#121212");
    //title element
    lineSvg.append("text")
            .attr("font-size","40px")
            .attr("y", 40)
            .attr("x", "50%")
            .attr("fill","white")
            .attr('text-anchor', 'start')
            .style("font-family","Arial")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("stroke","white")
            .style("stroke-width", "1")
            .style("opacity", 1)
            .text('Population Percentage in Poverty in ' + stateData[index].name + categories[categorySelect] + ' (2010 - 2019)')
			.attr("font-size","35px")

    lineSvg.selectAll('g').remove();
    let g = lineSvg.append('g')
        .attr('transform', `translate(${lineMargin.left}, ${lineMargin.top})`);

    let lineData = [];
    let maxPercentage = 0;

    for (var i = 0; i < 10; i++) {
    	var percentages = stateData[index].percent[2010 + i];
    	var pecent = 0;
    	switch (categorySelect) {
    		case 0: // by Race
    		percent = Math.max(
    			parseFloat(percentages['White']),
    			parseFloat(percentages['White alone, not Hispanic']),
    			parseFloat(percentages['Hispanic/Latino']),
    			parseFloat(percentages['Black']),
    			parseFloat(percentages['Asian']),
    			parseFloat(percentages['Native American']),
    			parseFloat(percentages['Pacific Islander']),
    			parseFloat(percentages['Two or More']),
    			parseFloat(percentages['Other'])
    		);
    		for (var j = 0; j < 9; j++) {
	    		lineData.push([]);
    		}
    			break;
    		case 1: // by Age
    		percent = Math.max(
    			parseFloat(percentages['Under 18']),
    			parseFloat(percentages['18 to 64']),
    			parseFloat(percentages['65 and up'])
    		);
    		for (var j = 0; j < 3; j++) {
	    		lineData.push([]);
    		}
    			break;
    		case 2: // by Education Level
    		percent = Math.max(
    			parseFloat(percentages['< High School']),
    			parseFloat(percentages['High School']),
    			parseFloat(percentages['Some College']),
    			parseFloat(percentages['>= Bachelor'])
    		);
    		for (var j = 0; j < 4; j++) {
	    		lineData.push([]);
    		}
    			break;
    		case 3: // by Sex
    		percent = Math.max(
    			parseFloat(percentages['Male']),
    			parseFloat(percentages['Female'])
    		);
    		for (var j = 0; j < 2; j++) {
	    		lineData.push([]);
    		}
    			break;
    		case 4: // by Nativity Status
    		percent = Math.max(
    			parseFloat(percentages['Native']),
    			parseFloat(percentages['Foreign born'])
    		);
    		for (var j = 0; j < 2; j++) {
	    		lineData.push([]);
    		}
    			break;
    		case 5: // by Employment Status
    		percent = Math.max(
    			parseFloat(percentages['Full-Time']),
    			parseFloat(percentages['Part-Time']),
    			parseFloat(percentages['No Work'])
    		);
    		for (var j = 0; j < 3; j++) {
	    		lineData.push([]);
    		}
    			break;
    		case 6: // by Disability Status
    		percent = Math.max(
    			parseFloat(percentages['Disability']),
    			parseFloat(percentages['No Disability'])
    		);
    		for (var j = 0; j < 2; j++) {
	    		lineData.push([]);
    		}
    			break;
    	}
    	if (percent > maxPercentage) {
    		maxPercentage = percent;
    	}
    }

    Object.keys(stateData[index].percent).forEach(year => {
    	var percentages = stateData[index].percent[year];
    	switch (categorySelect) {
    		case 0:
    		lineData[0].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['White'])
        	});
    		lineData[1].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['White alone, not Hispanic'])
        	});
    		lineData[2].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Hispanic/Latino'])
        	});
    		lineData[3].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Black'])
        	});
    		lineData[4].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Asian'])
        	});
    		lineData[5].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Native American'])
        	});
    		lineData[6].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Pacific Islander'])
        	});
    		lineData[7].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Two or More'])
        	});
    		lineData[8].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Other'])
        	});
    			break;
    		case 1:
    		lineData[0].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Under 18'])
        	});
    		lineData[1].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['18 to 64'])
        	});
    		lineData[2].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['65 and up'])
        	});
    			break;
    		case 2:
    		lineData[0].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['< High School'])
        	});
    		lineData[1].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['High School'])
        	});
    		lineData[2].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Some College'])
        	});
    		lineData[3].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['>= Bachelor'])
        	});
    			break;
    		case 3:
    		lineData[0].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Male'])
        	});
    		lineData[1].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Female'])
        	});
    			break;
    		case 4:
    		lineData[0].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Native'])
        	});
    		lineData[1].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Foreign born'])
        	});
    			break;
    		case 5:
    		lineData[0].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Full-Time'])
        	});
    		lineData[1].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Part-Time'])
        	});
    		lineData[2].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['No Work'])
        	});
    			break;
    		case 6:
    		lineData[0].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['Disability'].replace('-', '0'))
        	});
    		lineData[1].push({
            	year: new Date(year, 0),
            	percent: parseFloat(percentages['No Disability'].replace('-', '0'))
        	});
    			break;
    	}
    });

    let xScale = d3.scaleTime()
        .domain([new Date(2010, 0), new Date(2019, 0)])
        .range([0, lineInnerWidth]);

    let yScale = d3.scaleLinear()
        .domain([0, maxPercentage])
        .range([lineInnerHeight, 0]);

    let yAxis = g.append('g');
    yAxis.call(d3.axisRight(yScale)
            .tickSize(lineInnerWidth))
        .select('.domain').remove();
    yAxis.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke-opacity', 0.5)
        .attr('stroke-dasharray', '2,2');
    yAxis.selectAll('.tick text')
        .attr('text-anchor', 'end')
        .attr('x', -5)
        .attr('dy', 4)
        .style('font-size', '20px')
        .style('fill', 'white');
    let xAxis = g.append('g');
    xAxis.attr('transform', `translate(0,${lineInnerHeight})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(1)))
        .select('.domain')
        .style('stroke', 'gray');
    xAxis.selectAll('.tick text')
    	.style('font-size', '18px')
        .style('fill', 'white');
    xAxis.selectAll('.tick line')
        .style('stroke', 'gray');

    let singleLine = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.percent))
        .curve(d3.curveMonotoneX);

    for (var i = 0; i < lineData.length; i++) {
	    g.append('path')
	        .datum(lineData[i])
	        .attr('class', 'singleLine')
	        .style('fill', 'none')
	        .style('stroke', colors[i])
	        .style('stroke-width', '2')
	        .attr('d', singleLine);
    }
    g = lineSvg.append('g')
        .attr('transform', `translate(${lineWidth / 2}, ${lineHeight - 20})`)
		.style('color','white');
    g.append('text')
    	.style('font-size', '20px')
		.style('color','white')
		.style('stroke','white')
    	.text('Year');
    g = lineSvg.append('g')
        .attr('transform', `translate(30, ${lineHeight / 2}) rotate(-90)`)
		.style('color','white');
    g.append('text')
    	.style('font-size', '20px')
		.style('color','white')
		.style('stroke','white')
    	.attr('text-anchor', 'middle')
    	.text('Percentage');
    g = lineSvg.append('g')
        .attr('transform', `translate(${lineWidth / 2}, 20)`)
		.style('stroke','white')
		.style('color','white');
}
