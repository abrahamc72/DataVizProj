let stateData;
let mapData;
let yearSelection;
let attributeSelection;

document.addEventListener('DOMContentLoaded', function () {
    //Load Data From CSVs
    Promise.all([
        d3.csv('data/2019 Percents.csv'),
        d3.csv('data/2018 Percents.csv'),
        d3.csv('data/2017 Percents.csv'),
        d3.csv('data/2016 Percents.csv'),
        d3.csv('data/2015 Percents.csv'),
        d3.csv('data/2014 Percents.csv'),
        d3.csv('data/2013 Percents.csv'),
        d3.csv('data/2012 Percents.csv'),
        d3.csv('data/2011 Percents.csv'),
        d3.csv('data/2010 Percents.csv'),
        d3.csv('data/Abbrevs.csv'),
        d3.json('data/us-states.json'),
        d3.csv('data/2019 Adjusted Population.csv'),
        d3.csv('data/2018 Adjusted Population.csv'),
        d3.csv('data/2017 Adjusted Population.csv'),
        d3.csv('data/2016 Adjusted Population.csv'),
        d3.csv('data/2015 Adjusted Population.csv'),
        d3.csv('data/2014 Adjusted Population.csv'),
        d3.csv('data/2013 Adjusted Population.csv'),
        d3.csv('data/2012 Adjusted Population.csv'),
        d3.csv('data/2011 Adjusted Population.csv'),
        d3.csv('data/2010 Adjusted Population.csv'),
    ]).then(function (values) {
        var data2019Percent = values[0];
        var data2018Percent = values[1];
        var data2017Percent = values[2];
        var data2016Percent = values[3];
        var data2015Percent = values[4];
        var data2014Percent = values[5];
        var data2013Percent = values[6];
        var data2012Percent = values[7];
        var data2011Percent = values[8];
        var data2010Percent = values[9];
        var abbrev = values[10];
        mapData = values[11];
        var data2019Population = values[12];
        var data2018Population = values[13];
        var data2017Population = values[14];
        var data2016Population = values[15];
        var data2015Population = values[16];
        var data2014Population = values[17];
        var data2013Population = values[18];
        var data2012Population = values[19];
        var data2011Population = values[20];
        var data2010Population = values[21];
        stateData = Array(50);

        for(let i = 0; i < 50; i++)
        {
            var geoData = null;
            let percentData = {
                2019: data2019Percent[i],
                2018: data2018Percent[i],
                2017: data2017Percent[i],
                2016: data2016Percent[i],
                2015: data2015Percent[i],
                2014: data2014Percent[i],
                2013: data2013Percent[i],
                2012: data2012Percent[i],
                2011: data2011Percent[i],
                2010: data2010Percent[i],
            };
            let populationData = {
                2019: data2019Population[i],
                2018: data2018Population[i],
                2017: data2017Population[i],
                2016: data2016Population[i],
                2015: data2015Population[i],
                2014: data2014Population[i],
                2013: data2013Population[i],
                2012: data2012Population[i],
                2011: data2011Population[i],
                2010: data2010Population[i],
            };

            //while != mapFeatures i++
            for(let j = 0; j < 50; j++)
            {
                if (abbrev[i]["State Name"] === mapData.features[j].properties.name)
                {
                    geoData = mapData.features[j];
                    //break;
                }
            }
            stateData[i] = {
                name: abbrev[i]["State Name"],
                abbrev: abbrev[i]["State Abbrev"],
                percent: percentData,
                population: populationData,
                geo: geoData
            };
        }
        drawMap();
        lineReGraph();
        drawPicto();
    });
});
function yearSelectChange() {
    if( document.getElementById("yearSelect").value >= 2019)
    {
        document.getElementById("yearSelect").value = 2019;
    }
    else if( document.getElementById("yearSelect").value <= 2010)
    {
        document.getElementById("yearSelect").value = 2010;
    }
    document.getElementById("yearSlider").value = document.getElementById("yearSelect").value;
    adjustMap();
    graphState();
}
function yearSliderChange() {
    document.getElementById("yearSelect").value = document.getElementById("yearSlider").value;
    adjustMap();
    graphState();
}
function adjustMap() {
    yearSelection =  document.getElementById("yearSelect").value;
    attributeSelection = document.getElementById("mapAttributeSelect").value;
    var mapTitle = "Total Population below the National Poverty Line";
    switch(attributeSelection)
    {
        case "Total Population":
        {
            mapTitle = "Total Population below the National Poverty Line";
            break;
        }
        case "Male":
        {
            mapTitle = "Male Population below the National Poverty Line";
            break;
        }
        case "Female":
        {
            mapTitle = "Female Population below the National Poverty Line";
            break;
        }
        case "Under 18":
        {
            mapTitle = "Under Age 18 Population below the National Poverty Line";
            break;
        }
        case "Part-Time":
        {
            mapTitle = "Part-Time Working Population below the National Poverty Line";
            break;
        }
    }
    changeMapAttribute(mapTitle);

}


