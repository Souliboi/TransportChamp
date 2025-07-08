import {Connection, Remark, RemarkCode} from "./data.mjs";

const api = "https://v6.db.transport.rest"

/**
 * @typedef StopsParameters
 * @type {object}
 * @property {number} duration
 * @property {number} results
 * @property {boolean} linesOfStops
 * @property {boolean} remarks
 * @property {string} language
 */

/**
 * Returns the departing connections of a station.
 * Via-information is added if possible.
 *
 * @param {number} stationId Bahnhofs-/Haltestellenummer
 * @param {StopsParameters} params API parameters to pass to the stations API
 * @return {Promise<Connection[]>}
 */
export async function getDepartingConnections(stationId, params) {
    const response = await getDepartures(stationId, params);
    return Promise.all(response.map(async (departure) => {
        let via = []
        /**
         * @type {Remark[]}
         */
        let remarks = []
        let details = null
        try {
            details = await getTrip(departure.tripId, {
                language: params.language || "de",
                polyline: false,
                stopovers: true,
                remarks: true
            })
        } catch (e) {
            remarks.push(new Remark(
                "text",
                RemarkCode.TransChampError,
                "Fahrtdetails konnten nicht abgerufen werden.",
                e.toString(),
            ))
            console.error("Konnte Fahrtdetails nicht abrufen:", e)
        }
        if (details) {
            details.stopovers.forEach(stop => {
                // Comparing planned dates for stations after the current one.
                if (new Date(stop.plannedArrival) > new Date(departure.plannedWhen)) {
                    via.push(stop.stop.name)
                }
            })
            remarks.push(...(details.remarks || []))
        }
        remarks.push(...(departure.remarks || []))
        remarks.forEach(remark => {
            console.log(remark.type, remark.code, remark.text, remark.summary)
        })
        return new Connection(
            departure.line.name,
            departure.line.productName,
            departure.direction || departure.provenance || departure.destination.name,
            new Date(departure.when),        // Reales-when
            new Date(departure.plannedWhen), // Fahrplan-when
            departure.delay,
            departure.platform,
            departure.plannedPlatform,
            remarks,
            via
        )
    }))
}

/**
 * @typedef TripParams
 * @type {object}
 * @property {boolean} stopovers Parse and return stop data - they are encoded in the ID
 * @property {boolean} remarks Return additional remarks (e.g. bicycles, wheelchair access, ...)
 * @property {boolean} polyline Add geographical line data
 * @property {string} language Result language.
 */

/**
 * Fill in the "via" information for a connection (if any) as text.
 *
 * @param {string} tripId Trip ID (contains stops)
 * @param {TripParams} params
 * @return {Promise<Object>}
 */
export async function getTrip(tripId, params) {
    const encodedTrip = encodeURIComponent(tripId)
    const urlSearchParams = new URLSearchParams(
        Object.entries(params).map((e) => {return [e[0].toString(), e[1].toString()]})
    ).toString()
    const url = `${api}/trips/${encodedTrip}?${urlSearchParams}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
    }
    return (await response.json()).trip
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
    const url = `${api}/stops/${stationId}/${type}?` + urlSearchParams.toString();
    // duration=600&results=20&linesOfStops=false&remarks=true"
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}
