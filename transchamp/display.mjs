import {Connection, Remark} from "./data.mjs";

/**
 * Create an element with text and a space seperated list of class names.
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
 * Create an element with children and a space separated list of class names.
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
    // Time
    row.appendChild(elementWithText("th", "Abfahrt", "time"));
    // Status indicator (cancelled, realtime information, delay)
    row.appendChild(elementWithText("th", "", "indicator"));
    // Line number (e.g. RE-42, Bus 621, ICE 69)
    row.appendChild(elementWithText("th", "Linie", "line"));
    // (Final) destination of a train
    row.appendChild(elementWithText("th", "Richtung", "direction"));
    // Via (*all* stops on the way)
    row.appendChild(elementWithText("th", "Über", "via"));
    // Platform (if available)
    row.appendChild(elementWithText("th", "Gleis", "platform"));
    thead.appendChild(row);
    return thead
}

function formatDate(date) {
    return date.toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"})
}

/**
 *
 * @param {Remark[]} remarks
 * @return{HTMLMarqueeElement}
 */
function formatRemarks(remarks) {
    if (!remarks.length) {
        return document.createElement("marquee")
    }
    const text = " +++ " + remarks.map((remark) => {
        return remark.text
    }).join(" +++ ") + " +++ "
    return elementWithText("marquee", text, "");
}

/**
 * Format a single connection into two HTML table rows.
 * Yes, two rows!
 *
 * @param {Connection} connection
 * @returns {HTMLTableRowElement[]}
 */
function formatConnectionAsRows(connection){
    const cancelled = Remark.hasCancelled(connection.remarks);
    let status = document.createElement("td")
    if (cancelled) {
        status = elementWithText("td", "🗙", "indicator")
    } else if (connection.delay > 60) {
        status = elementWithText("td", (connection.delay / 60).toString(), "indicator delay")
    }

    const rows = []

    const firstRow = []
    firstRow.push(elementWithText("td", formatDate(connection.plannedDeparture), "time planned"))  // TODO: Add delay again
    firstRow.push(status)
    firstRow.push(elementWithText("td", connection.line, "line"))
    firstRow.push(elementWithText("td", connection.direction, "direction"))
    firstRow.push(elementWithChildren("td", [elementWithText("marquee", connection.via.join("; "))], "via"))
    firstRow.push(elementWithText("td", connection.plannedPlatform, "platform planned"))
    rows.push(elementWithChildren("tr", firstRow, cancelled ? "cancelled" : ""))

    const secondRow = []
    if (!cancelled && formatDate(connection.plannedDeparture) !== formatDate(connection.departure)) {
        secondRow.push(elementWithText("td", formatDate(connection.departure), "time actual"))
    } else {
        secondRow.push(elementWithText("td", "", "time"))
    }
    secondRow.push(document.createElement("td"))
    const remarks = elementWithChildren("td", [formatRemarks(connection.remarks)], "remarks")
    remarks.colSpan = "3"
    secondRow.push(remarks)
    if (!cancelled && connection.plannedPlatform !== connection.platform) {
        secondRow.push(elementWithText("td", connection.platform, "platform actual"))
    } else {
        secondRow.push(elementWithText("td", "", "platform"))
    }
    rows.push(elementWithChildren("tr", secondRow))
    return rows
}

/**
 * Format connections to a table.
 *
 * @param {Connection[]} connections
 * @return {HTMLTableElement}
 */
export function formatConnections(connections) {
    const tbl = document.createElement("table")
    tbl.className = "information"
    const tbody = document.createElement("tbody")
    tbody.append(...connections.map(formatConnectionAsRows).flat())

    tbl.appendChild(headingConnections())
    tbl.appendChild(tbody)
    return tbl
}
