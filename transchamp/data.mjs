/**
 * A list of all our known stations
 *
 * @enum {number}
 */
export const Stations = {
    Greifswald: 8010139,
    Stralsund: 8010338
}

/**
 * All known methods of transport available from departing connections
 *
 * @enum {string}
 */
export const Transport = {
    RE: "RE",
    BUS: "Bus",
    ICE: "ICE",
    IC: "IC",
    RUF: "RUF"
}

export class Connection {
    /**
     *
     * @param {string} line
     * @param {Transport} transportation
     * @param {string} direction
     * @param {Date} departure
     * @param {Date} plannedDeparture
     * @param {number} delay
     * @param {string|null} platform
     * @param {string|null} plannedPlatform
     * @param {Remark[]} remarks
     */
    constructor(line, transportation, direction, departure, plannedDeparture, delay, platform, plannedPlatform, remarks = []) {
        this.line = line;
        this.transport = transportation;
        this.direction = direction;
        this.departure = departure;
        this.plannedDeparture = plannedDeparture;
        this.delay = delay;
        this.platform = platform;
        this.plannedPlatform = plannedPlatform;
        this.remarks = remarks;
    }
}

/**
 * All known remark strings that aren't null
 *
 * @enum {string}
 */
export const RemarkCode = {
    Cancelled: "journey-cancelled",
    Alternative: "alternative-trip",
}

export class Remark {
    /**
     * @param {string} type
     * @param {RemarkCode|null} code
     * @param {string} text
     * @param {string|null} summary
     */
    constructor(type, code, text, summary = null) {
        this.type = type;
        this.code = code;
        this.text = text;
        this.summary = summary;
    }

    static hasCancelled(remarks) {
        return remarks.some((remark) => remark.code === RemarkCode.Cancelled)
    }
}