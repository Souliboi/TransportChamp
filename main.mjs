import {formatConnections} from "./transchamp/display.mjs";
import {getDepartingConnections} from "./transchamp/api.mjs";
import {Stations} from "./transchamp/data.mjs";

/**
 * Return all departing connections from a single given station
 *
 * @param {Stations} station
 * @return {HTMLElement}
 */
async function getDepartingConnectionsFromStation(station) {
    document.querySelector("body").replaceChildren(formatConnections(await getDepartingConnections(
            station, {
            duration: 600,
            results: 10,
            linesOfStops: false,
            remarks: true,
        })));
}

getDepartingConnectionsFromStation(Stations.Stralsund)