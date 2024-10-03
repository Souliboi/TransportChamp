function formatInfos(infos){
    let output = []
    for (let i = 0; i < infos.length; i++) {
        const info = infos[i];
        output.push(formatBody(info));
    }
    return output;
}

function formatBody(info){
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
    const body = document.querySelector("#departTable");
    const id = 8010338;
    const params = {
        duration: 600,
        results: 10,
        linesOfStops: false,
        remarks: true,
    };
    let departures = formatInfos(await getDepartures(id, params));
    body.replaceChildren(...departures)
})();

