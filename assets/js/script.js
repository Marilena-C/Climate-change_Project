// // Form inputs grabs
$('#form').on('submit', function(event) {
    event.preventDefault()
    var cityFrom = $('#from').val()
    var cityTo = $('#to').val()
    var waysInput = $('#ways').val()
    var peopleInput = $('#people').val()
    var transportInput = $('#transport').val()
    var titleInput = $('#title').val()

    console.log(cityFrom,cityTo)
    console.log(waysInput,peopleInput, transportInput)


    // const data = { username: 'example' };
    var data = {from:cityFrom,
        to:cityTo,
        ways:waysInput,
        people:peopleInput,
        language:"en",
        title:titleInput,
        transport_types:["flying","public-transport","driving"]
    }
    ///////////////////// My additional the JS provides a click func to the About //////////////////
    $(function() {
        $('#about-link').click(function() {
          $('#aboutModal').modal('show');
        });
      });
      
    ///////////////////////////////////////// END //////////////////////////////////////////////////

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'c0e654e005msh4c9a90bb5005fbbp1284cdjsn75b2a3c5f094',
            'X-RapidAPI-Host': 'travel-co2-climate-carbon-emissions.p.rapidapi.com'
        },
        // body: '{"from":"Berlin, Germany","to":"Stockholm, Sweden","ways":2,"people":2,"language":"en","title":"Comparing flying and public transport from Berlin to Stockholm.","transport_types":["flying","public-transport","driving"]}' 
        body: JSON.stringify(data) 
    };

    fetch('https://travel-co2-climate-carbon-emissions.p.rapidapi.com/api/v1/simpletrips', options)
        .then(response => response.json())
        .then(response => {console.log(response)
            console.log("CO2 Emission (Flight) = "+response.trips[0].co2e)
            console.log("CO2 Emission (Public Transport) = "+response.trips[1].co2e)
            $('#emissionData').html(
                `<p>CO2 Emission (Flight) = ${response.trips[0].co2e} kg</p>
                <p>CO2 Emission (Public Transport) = ${response.trips[1].co2e} kg</p>
                <p>CO2 Emission (driving) = ${response.trips[2].co2e} kg</p>
                <p> ${cityFrom}</p>`
                


            )
        })
        .catch(err => console.error(err));


})


// Intra city emission estimation
// FORM inputs grab
$('#form-2').on('submit', function(event) {
    event.preventDefault()
    var startLocation = $('#placename-1').val().trim()
    var endLocation = $('#placename-2').val().trim()
    var typeOfTransport = $('#trans-type').val().trim()
    var numWays = $('#trans-ways').val().trim()
    var numOfPeopleInTransit = $('#trans-people').val().trim()
    var typeOfAccomodation = $('#acco-type').val().trim()
    var numOfNightsInAccom = $('#acco-night').val().trim()
    var numOfPeopleInAccom = $('#acco-people').val().trim()
    console.log(startLocation)

    var data1 = {
        trips: [
            {
                steps: [
                    {
                        discovery: true,
                        location: {
                            placename: startLocation
                        },
                        transport: {
                            type: typeOfTransport,
                            ways: numWays,
                            people: numOfPeopleInTransit,
                            vehicle: {
                                type: "car-large",
                                fuel: {
                                    "type": "gasoline"
                                }
                            }
                        }
                    },
                    {
                        discovery: true,
                        location: {
                            placename: endLocation
                        },
                        accommodation: {
                            type: typeOfAccomodation,
                            nights: numOfNightsInAccom,
                            people: numOfPeopleInAccom
                        }
                    }
                ]
            }
        ],
        save: false,
        language: "en"
    }

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer {YOUR_API_KEY}',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-RapidAPI-Key': '0c2cfb20b1mshb958ecebd8b7dcep136256jsn2319ea00bacc',
            'X-RapidAPI-Host': 'travel-co2-climate-carbon-emissions.p.rapidapi.com'
        },
        body: JSON.stringify(data1)
    };

    fetch('https://travel-co2-climate-carbon-emissions.p.rapidapi.com/api/v1/trips', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            arrayOfSteps = response.trips[0].steps
            var sumOfTransport = 0
            var sumOfAccomodation = 0
            for (var i = 0; i < arrayOfSteps.length; i++) {
                if (arrayOfSteps[i].transport !=null) {
                    sumOfTransport = sumOfTransport + arrayOfSteps[i].transport.co2e
                }
                if (arrayOfSteps[i].accommodation !=null) {
                    sumOfAccomodation = sumOfAccomodation + arrayOfSteps[i].accommodation.co2e
                }
            }

            $('#emissionData').html(
                `<p>CO2 Emission (Transport) = ${sumOfTransport} kg</p>
                <p>CO2 Emission (accommodation) = ${sumOfAccomodation} kg</p>
                                    ---------------------------
                <p>CO2 Emission (TOTAL) = ${response.trips[0].co2e} kg</p>
                <p>CO2 Emission (TOTAL) = ${sumOfTransport+sumOfAccomodation} kg</p>`


            )
        })
        .catch(err => console.error(err));
})





 



