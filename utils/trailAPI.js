fetch ("https://www.hikingproject.com/data/get-trails?lat=47.6045335&lon=-122.3531904&maxDistance=30&key=200685387-0d1f511c4df4599326d988945a93ebf8&maxResults=5").then(response => response.json()).then(res => {

    let trails = res.trails.map(event => {
        return {
            name: event.name,
            summary: event.summary,
            location: event.location,
            img: event.imgSmall,
            length: event.length
        }
    })
    console.log(trails[0]);
    
    document.getElementById('trails').innerHTML = JSON.stringify(trails);

}).catch(err => {
    console.log(err);
})
