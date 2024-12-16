import {formatConnections} from "./transchamp/display.mjs";
import {getDepartingConnections} from "./transchamp/api.mjs";

document.querySelector("body").replaceChildren(formatConnections(await getDepartingConnections(
    // 8010338, {
    8010139, {
    duration: 600,
    results: 10,
    linesOfStops: false,
    remarks: true,
})));