
// Data for first graph:
var diversey_rides_byDay_2018_2019 = [{ 'day': 'Friday', 'rides': 559962 },
{ 'day': 'Monday', 'rides': 541304 },
{ 'day': 'Saturday', 'rides': 287241 },
{ 'day': 'Sunday', 'rides': 205548 },
{ 'day': 'Thursday', 'rides': 581781 },
{ 'day': 'Tuesday', 'rides': 592345 },
{ 'day': 'Wednesday', 'rides': 580728 }]



tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')




// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".graph_ridersbyDay")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3.scaleBand()
    .range([0, width])
    .domain(diversey_rides_byDay_2018_2019.map(function (d) { return d.day; }))
    .padding(0.2);


svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, d3.max(diversey_rides_byDay_2018_2019, function (d) { return d.rides; })])
    .range([height, 0]);


svg.append("g")
    .call(d3.axisLeft(y));

svg.selectAll("bar")
    .data(diversey_rides_byDay_2018_2019)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.day); })
    .attr("y", function (d) { return y(d.rides); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.rides); })
    .attr("fill", "#69b3a2")
    .on('mouseover', function (d, i) {
        tooltip
            .html(
                `<div>Rides: ${d.rides}</div>`
            )
            .style('visibility', 'visible');
        d3.select(this).transition().attr('fill', '#eec42d');
    })
    .on('mousemove', function () {
        tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function () {
        tooltip.html(``).style('visibility', 'hidden');
        d3.select(this).transition().attr('fill', "#69b3a2");
    });




//---------------------------------- Scatter plot ----------------------------------// :
// set the dimensions and margins of the graph
//var margin = { top: 30, right: 30, bottom: 70, left: 60 }

var widthScatter = 1400 - margin.left - margin.right
var heightScatter = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgScatter = d3.select(".scatter_plot")
    .append("svg")
    .attr("width", widthScatter + margin.left + margin.right)
    .attr("height", heightScatter + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



d3.csv("minmaxdiffDf.csv")
    .get(function (data) {

        // Add X axis
        //console.log(data)

        stations = []
        for (var i = 0; i < data.length; i++) {
            stations.push(data[i].stationName);
        }


        var xScatter = d3.scaleBand()
            .range([0, widthScatter])
            .domain(stations)
            .padding(1);


        svgScatter.append("g")
            .attr("transform", "translate(0," + heightScatter + ")")
            .call(d3.axisBottom(xScatter))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .style("font-size", "7px");



        var differences = []
        for (var i = 0; i < data.length; i++) {
            differences.push(data[i].difference);
        }


        // Add Y axis


        var yscatter = d3.scaleLinear()
            .domain([Math.min(...differences), Math.max(...differences)])
            .range([heightScatter, 0]);
        svgScatter.append("g")
            .call(d3.axisLeft(yscatter));

        // Add dots
        svgScatter.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScatter(d.stationName); })
            .attr("cy", function (d) { return yscatter(d.difference); })
            .attr("r", 3)
            .style("fill", "#69b3a2")
            .on('mouseover', function (d, i) {
                tooltip
                    .html(
                        `<div>Station: ${d.stationName}</div>
                        <hr>
                        <div>Day with most rides: ${d.maxDay}</div>
                        <div>Rides: ${d.maxval}</div>
                        <hr>
                        <div>Day with least rides: ${d.minDay}</div>
                        <div>Rides: ${d.minval}</div>
                        <hr>
                        <div>Difference: ${d.difference}</div>`
                    )
                    .style('visibility', 'visible');

                d3.select(this).transition().attr('fill', '#eec42d');


                d3.select(this)
                    .style('fill', 'orange')
                    .style('r', 12)


            })
            .on('mousemove', function () {
                tooltip
                    .style('top', d3.event.pageY - 10 + 'px')
                    .style('left', d3.event.pageX + 10 + 'px');
            })
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).transition().attr('fill', "#437c90");

                d3.select(this)
                    .style('fill', "#69b3a2")
                    .style('r', 3)


            });
    });


//------------------------------------------------------------------------------------------------------ 


//DISPLAY THE MAP OF CHICAGO Geodata :

d3.json('chicagoGeo.json', function (error, data) {




    var districts = topojson.feature(data, data['objects']['Boundaries - ZIP Codes']);



    //SVG dimentions 
    var height = 700,
        width = 600,
        projection = d3.geoMercator(),
        map


    // ------------ Path & Projection ------------ //
    var path = d3.geoPath().projection(projection);


    // -------- Append SVG to map div -------- //
    var svg = d3.select(".mapSvg")
        //.append("svg")
        .attr("class", "generalSVG")
        .attr("width", width)
        .attr("height", height)
        .style("position", "relative")
        .style("top", "0%")
        .style("left", "-12%")
    // .style("opacity", "0.3")
    // ------------------------------------------- //







    //-----------------------------SCALE AND TRANSLATE---------------------------//
    var b, s, t;
    projection.scale(1).translate([0, 0]);
    var b = path.bounds(districts); // bounds represent a two dimensional array : [[left, bottom], [right, top]],
    var s = .5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    projection.scale(s).translate(t);




    // ----------------- APPENING G ELEMENT AND INJECTING THE DATA -----------------//




    // THEATRES INFORMATION

    var theatresAndStations = [
        {
            'theatre': 'Music Box Theatre',
            'nearestStation': 'South Port Station',
            'districtTheatre': 'North',
            'theatreLat': 41.949863069429554,
            'theatreLng': -87.66384932945947,
            'zipcode': 60613,
            'stationLat': 41.94385877651749,
            'stationLon': -87.66357061851318
        },


        {
            'theatre': 'The Vic Theatre',
            'nearestStation': 'Belmotn Station',
            'districtTheatre': 'North',
            'theatreLat': 41.93955531775936,
            'theatreLng': -87.65390728225663,
            'zipcode': 60657,
            'stationLat': 41.939653562890385,
            'stationLon': -87.6534313065544


        },


        {
            'theatre': 'The Logan Theatre',
            'nearestStation': 'Logan Square Station',
            'districtTheatre': 'Northwest',
            'theatreLat': 41.929748830589396,
            'theatreLng': -87.70891514039803,
            'zipcode': 60647,
            'stationLat': 41.92971297589272,
            'stationLon': -87.7076960881498

        },

        {
            'theatre': 'Gene Siskel Film Center',
            'nearestStation': 'Lake Station',

            'districtTheatre': 'Central',

            'theatreLat': 41.884925065454944,
            'theatreLng': -87.62817134169397,
            'zipcode': 60601,
            'stationLat': 41.88512657644788,
            'stationLon': -87.62807488225026


        },


        {
            'theatre': 'The Davis Theatre',
            'nearestStation': 'Western Station',

            'districtTheatre': 'North',

            'theatreLat': 41.965294926644766,
            'theatreLng': -87.6866023021865,
            'zipcode': 60625,
            'stationLat': 41.966171608502385,
            'stationLon': -87.68858306981954

        },


        {
            'theatre': 'Facets Cinemateque',
            'nearestStation': 'Fullerton Station',

            'districtTheatre': 'North',

            'theatreLat': 41.925018824709774,
            'theatreLng': -87.66651564414282,
            'zipcode': 60614,
            'stationLat': 41.92517990451284,
            'stationLon': -87.65277028003388

        },

        /*================================================== */




    ]



    map = svg.append('g').attr('class', 'boundary'); // In this "g" tag we will include the path for the district boundaries.
    chicago = map.selectAll('path').data(districts.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style("stroke", "black")
        .style("fill-opacity", .4)
        .attr("stroke-width", .2)
        .attr("fill", "#A0A0A0")
        .attr('fill', function (d) {

            var zipCde = d.properties.zip

            for (var c = 0; c < theatresAndStations.length; c++) {

                if (parseInt(zipCde) == parseInt(theatresAndStations[c].zipcode)) {
                    return 'red'
                }
            }
        })
        .style("opacity", "0.3")
        .on("click", function (d) {

            var zipCodeClicked = d.properties.zip
            displayCharts(zipCodeClicked)

        })









    //var coordsObj = { 'lat': 41.8320478, 'lng': -87.6258867, 'zipcode': '60616' }
    //var divLeftStyle = projection([coordsObj.lng.toString(), coordsObj.lat.toString()])[0]
    //var divTopStyle = projection([coordsObj.lng.toString(), coordsObj.lat.toString()])[1]
    //console.log(divLeftStyle);
    //console.log(divTopStyle);


    // Process the coords of each place so that they can be displayed within the boundaries of the displayed map:
    let processedInputs = []
    for (var i = 0; i < theatresAndStations.length; i++) {

        var divLeftStyle = projection([theatresAndStations[i].theatreLng.toString(), theatresAndStations[i].theatreLat.toString()])[0]
        var divTopStyle = projection([theatresAndStations[i].theatreLng.toString(), theatresAndStations[i].theatreLat.toString()])[1]


        var divLeftStyleStation = projection([theatresAndStations[i].stationLon.toString(), theatresAndStations[i].stationLat.toString()])[0]
        var divTopStyleStation = projection([theatresAndStations[i].stationLon.toString(), theatresAndStations[i].stationLat.toString()])[1]


        processedInputs.push({
            'cx': divLeftStyle,
            'cy': divTopStyle,
            'theatre': theatresAndStations[i].theatre,
            'cxStation': divLeftStyleStation,
            'cyStation': divTopStyleStation,
            'stationName': theatresAndStations[i].nearestStation
        })

    }





    map.selectAll('circle')
        .data(processedInputs)
        .enter()
        .append('circle')
        .attr("cx", function (d) { return d.cx })
        .attr("cy", function (d) { return d.cy })
        .attr("id", "placeCirle")
        .attr("r", 3)
        .attr("fill", "#D35400")
        .on('mouseover', function (d, i) {
            tooltip
                .html(
                    `<div>Theatre name: ${d.theatre}</div>
                    <hr>`
                )
                .style('visibility', 'visible');

            d3.select(this)

                .style('r', 12)
        })
        .on('mousemove', function () {
            tooltip
                .style('top', d3.event.pageY - 10 + 'px')
                .style('left', d3.event.pageX + 10 + 'px');
        })

        .on('mouseout', function () {
            tooltip.html(``).style('visibility', 'hidden');
            d3.select(this).transition().attr('fill', "#437c90");

            d3.select(this)
                .style('fill', "#D35400")
                .style('r', 2.5)
        });



    map.selectAll('.circleSt')
        .data(processedInputs)
        .enter()
        .append('circle')
        .attr("class", 'circleSt')
        .attr("cx", function (d) { return d.cxStation })
        .attr("cy", function (d) { return d.cyStation })
        .attr("id", "placeCirle")
        .attr("r", 1)
        .attr("fill", "blue")
        .on('mouseover', function (d, i) {
            tooltip
                .html(
                    `<div>Station name: ${d.stationName}</div>
                    <hr>`
                )
                .style('visibility', 'visible');

            d3.select(this)
                .style('fill', 'blue')
                .style('r', 12)
        })
        .on('mousemove', function () {
            tooltip
                .style('top', d3.event.pageY - 10 + 'px')
                .style('left', d3.event.pageX + 10 + 'px');
        })

        .on('mouseout', function () {
            tooltip.html(``).style('visibility', 'hidden');


            d3.select(this)
                .style('fill', "blue")
                .style('r', 1)
        });


    //.attr('d', d3.symbol().type(function (d, i) { return d3.symbols[1]; }))
})





function displayCharts(zipcode_) {

    d3.json('zipcodesData.json', function (error, data) {


        function returnIndexAndClearSvgs() {
            for (var i = 0; i < data.length; i++) {
                if (data[i].zipcode === parseInt(zipcode_)) {
                    return i
                }
            }
        }
        var index_ = returnIndexAndClearSvgs()


        console.log(typeof (index_));
        //console.log(data);

        if (typeof (index_) == 'number') {
            console.log('ksksksks')
            //====================================================================//
            // CLEAR SVG:
            var agesGraph = document.getElementById('ages_graph');
            var ethnicitesGraph = document.getElementById('ethnicites_graph');
            var educationGraph = document.getElementById('education_graph');
            var incomeGraph = document.getElementById('income_graph');

            agesGraph.innerHTML = "";
            ethnicitesGraph.innerHTML = "";
            educationGraph.innerHTML = "";
            incomeGraph.innerHTML = "";

            //====================================================================//


            // INCOME DATA:

            var firstRecordIncome = data[index_]['Income']

            // set the dimensions and margins of the graph
            var margin = { top: 30, right: 30, bottom: 70, left: 60 },
                width = 600 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            // append the svg object to the body of the page

            var margintopp = margin.top + 10
            var svgIncome = d3.select("#income_graph")
                .append("svg")
                .attr("width", 400)
                .attr("height", 500)
                .attr("viewBox", "10 0 650 940")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margintopp + ")");


            // X axis
            var x_ = d3.scaleBand()
                .range([0, width])
                .domain(Object.keys(firstRecordIncome))
                .padding(0.2);


            svgIncome.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x_))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")


            // Add Y axis
            var y_ = d3.scaleLinear()
                .domain([0, d3.max(Object.values(firstRecordIncome))])
                .range([height, 0])

            svgIncome.append("g")
                .call(d3.axisLeft(y_))

            datasIncome = []

            for (var i = 0; i < Object.keys(firstRecordIncome).length; i++) {
                datasObj = {}
                datasObj['incomeRange'] = Object.keys(firstRecordIncome)[i];
                datasObj['incomePercentage'] = Object.values(firstRecordIncome)[i];
                datasIncome.push(datasObj)
            }


            svgIncome.selectAll("rect")
                .data(datasIncome)
                .enter()
                .append("rect")
                .attr('class', 'bar')
                .attr("x", function (d) { return x_(d.incomeRange); })
                .attr("y", function (d) { return y_(d.incomePercentage); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y_(d.incomePercentage); })
                .attr("fill", "blue")
                .on('mouseover', function (d, i) {
                    tooltip
                        .html(
                            `<div>${d.incomeRange}:</div>
                            <div>${d.incomePercentage}%</div>
                            `
                        )
                        .style('visibility', 'visible');


                })
                .on('mousemove', function () {
                    tooltip
                        .style('top', d3.event.pageY - 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px');
                })

                .on('mouseout', function () {
                    tooltip.html(``).style('visibility', 'hidden');

                });




            //====================================================================//
            //====================================================================//
            //====================================================================//
            //AGES DATA: 
            var agesData = data[index_]['ages']

            var svgAges = d3.select("#ages_graph")
                .append("svg")
                .attr("width", width - 200)
                .attr("height", + height - 100)


            var heigt__ = height - 248;
            var width__ = width - 330;
            var gAges = svgAges.append("g")
                .attr("transform", "translate(" + width__ + "," + heigt__ + ")");


            // set the color scale
            var color = d3.scaleOrdinal()
                .domain(agesData)
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])


            var pie = d3.pie()
            //console.log(pie(Object.values(agesData)));

            var radius = Math.min(width, height) / 3.5;

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            console.log(agesData)

            var arcs = gAges.selectAll("arc")
                .data(pie(Object.values(agesData)))
                .enter()
                .append("g")
                .attr("class", "arc")





            function displageRange(dato) {

                for (var w = 0; w < Object.keys(agesData).length; w++) {

                    if (parseInt(dato) === parseInt(Object.values(agesData)[w])) {
                        console.log('sasdfasd')
                        return (Object.keys(agesData)[w])
                    }

                }
            }




            arcs.append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", arc)
                .on('mouseover', function (d, i) {
                    tooltip
                        .html(
                            `<div>${displageRange(d.data)}:</div>
                            <div>${d.data}%</div>
                            `
                        )
                        .style('visibility', 'visible');


                })
                .on('mousemove', function () {
                    tooltip
                        .style('top', d3.event.pageY - 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px');
                })

                .on('mouseout', function () {
                    tooltip.html(``).style('visibility', 'hidden');

                });


            //====================================================================//
            //ETHNICITIES DATA: 


            var raceData = data[index_]['race']


            var svgRace = d3.select("#ethnicites_graph")
                .append("svg")
                .attr("width", width - 200)
                .attr("height", height - 100)

            var gRace = svgRace.append("g")
                .attr("transform", "translate(" + width__ + "," + heigt__ + ")");


            // set the color scale
            var colorRace = d3.scaleOrdinal()
                .domain(raceData)
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])


            var pieRace = d3.pie()
            //console.log(pie(Object.values(raceData)));

            var radiusRace = Math.min(width, height) / 2;

            var arcRace = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            var arcsRace = gRace.selectAll("arc")
                .data(pie(Object.values(raceData)))
                .enter()
                .append("g")
                .attr("class", "arc")






            function displageRace(dato) {

                for (var w = 0; w < Object.keys(raceData).length; w++) {

                    if (parseInt(dato) === parseInt(Object.values(raceData)[w])) {
                        console.log('sasdfasd')
                        return (Object.keys(raceData)[w])
                    }

                }
            }




            arcsRace.append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", arcRace)
                .on('mouseover', function (d, i) {
                    tooltip
                        .html(
                            `
                        <div>${displageRace(d.data)}:</div>
                        <div>${d.data}%</div>
                        `
                        )
                        .style('visibility', 'visible');

                })
                .on('mousemove', function () {
                    tooltip
                        .style('top', d3.event.pageY - 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px');
                })

                .on('mouseout', function () {
                    tooltip.html(``).style('visibility', 'hidden');

                });




            //====================================================================//
            //EDUCATION DATA: 

            var educationData = data[index_]['education_over25']


            var marginTopprr = margintopp + 50

            var svgEducation = d3.select("#education_graph")
                .append("svg")
                .attr("width", 400)
                .attr("height", 500)
                .attr("viewBox", "10 0 650 1100")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + marginTopprr + ")");


            // X axis
            var x_Edu = d3.scaleBand()
                .range([0, width])
                .domain(Object.keys(educationData))
                .padding(2);


            svgEducation.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x_Edu))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")




            // Add Y axis
            var y_Edu = d3.scaleLinear()
                .domain([0, d3.max(Object.values(educationData))])
                .range([height, 0])


            svgEducation.append("g")
                .call(d3.axisLeft(y_Edu))


            datasEducation = []
            for (var i = 0; i < Object.keys(educationData).length; i++) {
                datasObjEdu = {}
                datasObjEdu['educationLevel'] = Object.keys(educationData)[i];
                datasObjEdu['educationPercentage'] = Object.values(educationData)[i];
                datasEducation.push(datasObjEdu)
            }


            svgEducation.selectAll("rect")
                .data(datasEducation)
                .enter()
                .append("rect")
                .attr('class', 'bar')
                .attr("x", function (d) { return x_Edu(d.educationLevel); })
                .attr("y", function (d) { return y_Edu(d.educationPercentage); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y_Edu(d.educationPercentage); })
                .attr("fill", "blue")
                .on('mouseover', function (d, i) {
                    tooltip
                        .html(
                            `<div>${d.educationLevel}:</div>
                            <div>${d.educationPercentage}%</div>
                            `
                        )
                        .style('visibility', 'visible');


                })
                .on('mousemove', function () {
                    tooltip
                        .style('top', d3.event.pageY - 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px');
                })

                .on('mouseout', function () {
                    tooltip.html(``).style('visibility', 'hidden');

                });


        } else {

            alert('Select a Zipcode highlighted in red')
        }



    })
}

displayCharts(60613)



// Display chivagos map again:


//DISPLAY THE MAP OF CHICAGO Geodata :

d3.json('chicagoGeo.json', function (error, data) {




    var districts = topojson.feature(data, data['objects']['Boundaries - ZIP Codes']);



    //SVG dimentions 
    var height = 800,
        width = 700,
        projection = d3.geoMercator(),
        map


    // ------------ Path & Projection ------------ //
    var path = d3.geoPath().projection(projection);


    // -------- Append SVG to map div -------- //
    var svg = d3.select(".mapRestSvg")
        .attr("width", width)
        .attr("height", height)
        .style("position", "relative")
        .style("top", "0%")
        .style("left", "21%")
    // .style("opacity", "0.3")
    // ------------------------------------------- //







    //-----------------------------SCALE AND TRANSLATE---------------------------//
    var b, s, t;
    projection.scale(1).translate([0, 0]);
    var b = path.bounds(districts); // bounds represent a two dimensional array : [[left, bottom], [right, top]],
    var s = .5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    projection.scale(s).translate(t);




    // ----------------- APPENING G ELEMENT AND INJECTING THE DATA -----------------//


    d3.json('newRestaurants.json', function (error, newRestaurantsData) {

        //console.log(newRestaurantsData.zipcode);

        var amountResApplications = []
        for (var i = 0; i < newRestaurantsData.length; i++) {
            var amount = newRestaurantsData[i].applications
            amountResApplications.push(amount)
        }
        console.log(newRestaurantsData)

        var minRestApplications = d3.min(amountResApplications)
        var maxRestApplications = d3.max(amountResApplications)


        var color = d3.scaleLinear()
            .domain([minRestApplications, maxRestApplications])
            .range(['white', 'blue']);

        // console.log(districts.features)

        function amountApplications(zipCode) {
            for (var i = 0; i < newRestaurantsData.length; i++) {
                if (zipCode === newRestaurantsData[i].zipcode) {
                    //console.log(newRestaurantsData[i].zipcode, ': ', newRestaurantsData[i].applications)
                    return (newRestaurantsData[i].applications)
                }
            }
        }

        map = svg.append('g').attr('class', 'boundary'); // In this "g" tag we will include the path for the district boundaries.
        chicago = map.selectAll('path').data(districts.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'zipcodeBoundaries')
            .style("stroke", "black")
            .style("fill-opacity", 1)
            .attr("stroke-width", .2)
            //.attr("fill", "#A0A0A0")
            .style("opacity", "0.3")
            .attr('fill', function (d) {
                var zipCde = d.properties.zip
                for (var i = 0; i < newRestaurantsData.length; i++) {
                    if (zipCde === newRestaurantsData[i].zipcode) {
                        //console.log(newRestaurantsData[i].zipcode, ': ', newRestaurantsData[i].applications)
                        return color(newRestaurantsData[i].applications)
                    }
                }
            })

            .on('mouseover', function (d, i) {
                tooltip
                    .html(
                        `<div>Zipcode: ${d.properties.zip}</div>
                        <hr>
                        <div>Applications for New Restaurants: ${amountApplications(d.properties.zip)}</div`

                    )
                    .style('visibility', 'visible');


            })


            .on('mousemove', function () {
                tooltip
                    .style('top', d3.event.pageY - 10 + 'px')
                    .style('left', d3.event.pageX + 10 + 'px');
            })

            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');



            });





    })


})