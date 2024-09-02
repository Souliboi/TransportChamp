function format(infos){
    let output = []
    for (let i = 0; i < infos.length; i++) {
        const info = infos[i];
        // console.log('=====')
        // console.log(info.direction || info.provenance);
        // console.log(info.line.name);
        // const time = new Date(info.plannedWhen)
        // console.log(time.getHours() + ':' + time.getMinutes());
        output.push(formatInfo(info));
    }
    return output;
}

function formatInfo(info){
    const container = document.createElement("tr")
    const lineName = document.createElement("td")
    const destination = document.createElement("td")
    const time = document.createElement("td")
    const realTime = new Date(info.plannedWhen)
    destination.innerText = info.direction || info.provenance;
    lineName.innerText = info.line.name;
    time.innerText = realTime.toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"});

    container.className = "container"
    container.appendChild(lineName)
    lineName.className = "line"
    destination.className = "destination"
    container.appendChild(destination)
    time.className = "time"
    container.appendChild(time)
    return container
}


async function getDepartures(id, params) {
    return (await queryStops("departures", id, params)).departures
}

async function getArrivals(id, params) {
    return (await queryStops("arrivals", id, params)).arrivals
}

async function queryStops(type, id, params) {
    const urlSearchParams = new URLSearchParams(params);
    const url = `https://v6.db.transport.rest/stops/${id}/${type}?` + urlSearchParams.toString();
    // duration=600&results=20&linesOfStops=false&remarks=true"
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
}

(async () => {
    const departBody = document.querySelector("#departTable")
    const arriveBody = document.querySelector("#arriveTable")
    const id = 8010338;
    const params = {
        duration: 600,
        results: 10,
        linesOfStops: false,
        remarks: true,
    };
    const addParams = structuredClone(params);
    addParams.direction = "325719";
    let departures = format(await getDepartures(id, params));
    // let departSep = document.createElement("h2")
    // departSep.innerText = "Departures"
    let arrivals = format(await getArrivals(id, addParams))
    // let arrivalSep = document.createElement("h2")
    // arrivalSep.innerText = "Arrivals"
    departBody.replaceChildren(...departures)
    arriveBody.replaceChildren(...arrivals)
})();

