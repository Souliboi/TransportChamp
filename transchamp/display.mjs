
import {Connection, Remark} from "./data.mjs";

/**
 *
 * @param {string} element
 * @param {string} text
 * @param {string} className
 * @returns {HTMLElement}
 */
function elementWithText(element, text, className = "") {
    const htmlElement = document.createElement(element);
    htmlElement.innerText = text;
    htmlElement.className = className;
    return htmlElement;
}


/**
 *
 * @param {string} element
 * @param {HTMLElement[]} children
 * @param {string} className
 * @returns {HTMLElement}
 */
function elementWithChildren(element, children, className = "") {
    const htmlElement = document.createElement(element);
    htmlElement.append(...children)
    htmlElement.className = className;
    return htmlElement;
}


/**
 * Return the heading of the departure table.
 * @returns {HTMLTableSectionElement}
 */
function headingConnections() {
    const thead = document.createElement("thead")
    const row = document.createElement("tr");
    row.appendChild(elementWithText("th", "Abfahrt", "time"));
    row.appendChild(elementWithText("th", "Linie", "line"));
    row.appendChild(elementWithText("th", "Richtung", "direction"));
    row.appendChild(elementWithText("th", "Gleis", "platform"));
    thead.appendChild(row);
    return thead
}

function formatDate(date) {
    return date.toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"})
}

/**
 *
 * @param {Date} actual
 * @param {Date} planned
 * @param {number} delay
 * @return {HTMLElement[]}
 */
function formatDeparture(actual, planned, delay) {
    const departureElements = [];
    departureElements.push(elementWithText("span", formatDate(actual), "actual"));
    departureElements.push(document.createElement("br"));
    departureElements.push(elementWithText("span", formatDate(planned), "planned"));
    if (delay && delay >= 60) {
        departureElements.push(elementWithText("span", (delay / 60).toFixed(0), "delay"));
    }
    return departureElements;
}


/**
 *
 * @param {Remark[]}remarks
 */
function formatRemarks(remarks) {
    if (!remarks.length) {
        return []
    }
    const text = " +++ " + remarks.map((remark) => {
        return remark.text
    }).join(" +++ ") + " +++ "
    return elementWithText("marquee", text, "");
}

/**
 * Format a single connection into an HTML table row.
 *
 * @param {Connection} connection
 * @returns {HTMLTableRowElement}
 */
function formatConnectionAsRow(connection){
    const connectionRow = document.createElement("tr")
    connectionRow.appendChild(elementWithChildren("td", formatDeparture(connection.departure, connection.plannedDeparture, connection.delay), "time"))
    connectionRow.appendChild(elementWithText("td", connection.line, "line"))
    connectionRow.appendChild(elementWithChildren("td", [
        document.createTextNode(connection.direction),
        document.createElement("br"),
        formatRemarks(connection.remarks)
    ], "direction"))
    connectionRow.appendChild(elementWithText("td", connection.platform || "", "platform"))
    if (Remark.hasCancelled(connection.remarks)) {
        connectionRow.classList.add("cancelled")
    }
    return connectionRow
}

/**
 * @param {Connection[]} connections
 * @return {HTMLTableElement}
 */
export function formatConnections(connections) {
    const tbl = document.createElement("table")
    tbl.className = "information"
    const tbody = document.createElement("tbody")
    tbody.append(...connections.map(formatConnectionAsRow))

    tbl.appendChild(headingConnections())
    tbl.appendChild(tbody)
    return tbl
}