import {Connection} from "./data.mjs";

/**
 * @typedef StopsParameters
 * @type {object}
 * @property {number} duration
 * @property {number} results
 * @property {boolean} linesOfStops
 * @property {boolean} remarks
 */



/**
 * Returns the departing connections of a station.
 *
 * @param {number} stationId Bahnhofs-/Haltestellenummer
 * @param {StopsParameters} params API parameters to pass to the stations API
 * @return {Promise<Connection[]>}
 */
export async function getDepartingConnections(stationId, params) {
    const response = await getDepartures(stationId, params);
    return response.map((departure) => {
        return new Connection(
            departure.line.name,
            departure.line.productName,
            departure.direction || departure.provenance || departure.destination.name,
            new Date(departure.when),        // Reales-when
            new Date(departure.plannedWhen), // Fahrplan-when
            departure.delay,
            departure.platform,
            departure.plannedPlatform,
            departure.remarks,
        )
    })
}

// The following fluff might need major refactoring

/**
 *
 * @param {number} stationId
 * @param {StopsParameters} params
 * @returns {Promise<Object>}
 */
async function getDepartures(stationId, params) {
    return (await queryStops("departures", stationId, params)).departures
}

/**
 *
 * @param {string} type
 * @param {number} stationId
 * @param {StopsParameters} params
 * @returns {Promise<Object>}
 */
async function queryStops(type, stationId, params) {
    const urlSearchParams = new URLSearchParams(
        Object.entries(params).map((e) => {return [e[0].toString(), e[1].toString()]})
    )
    const url = `https://v6.db.transport.rest/stops/${stationId}/${type}?` + urlSearchParams.toString();
    // duration=600&results=20&linesOfStops=false&remarks=true"
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
}
