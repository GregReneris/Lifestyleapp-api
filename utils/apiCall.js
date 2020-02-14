fetch("https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=dwXD5AKGG1cYnioNAAh1PSKaTZu2TIVN&city=seattle&startDateTime=2020-02-14T14:00:00Z").then(response => {

    return response.json()

}).then(data => {
    let ticketMaster = data._embedded.events.map(event => {
        return {
            name: event.name,
            img: event.images[0].url,
            date: event.dates.start.localDate,
            url: event.url
        }
    })
    
    document.getElementById('ticketMaster').innerHTML = JSON.stringify(ticketMaster);
});

// seattle lat and lon 47.6045335,-122.3531904
// let newEventsOne = [];
// data._embedded.events.forEach(event => {
//     // console.log(data);
//     let newEvent = {
//         name: event.name,
//         img: event.images[0].url,
//         date: event.dates.start.localDate
//     };
//     newEventsOne.push(newEvent)

// })