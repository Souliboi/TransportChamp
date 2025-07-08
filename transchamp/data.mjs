/**
 * A list of all our known stations
 *
 * @enum {number}
 */
export const Stations = {
    Greifswald: 8010139,
    Stralsund: 8010338,
    Ruegendamm: 8013062,
    Ozeaneum: 325666,
    Wasserstrasse: 325719,

    // Test stations, always busy.
    Südkreuz: 8011113,
    Berlin: 8011160,
    Hamburg: 8002549,
    München: 8000261,
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
     * All details of a connection.
     * @param {string} line
     * @param {Transport} transportation
     * @param {string} direction
     * @param {Date} departure
     * @param {Date} plannedDeparture
     * @param {number} delay
     * @param {string|null} platform
     * @param {string|null} plannedPlatform
     * @param {Remark[]} remarks
     * @param {string[]} via
     */
    constructor(line, transportation, direction, departure, plannedDeparture, delay, platform, plannedPlatform, remarks = [], via = []) {
        this.line = line;
        this.transport = transportation;
        this.direction = direction;
        this.departure = departure;
        this.plannedDeparture = plannedDeparture;
        this.delay = delay;
        this.platform = platform;
        this.plannedPlatform = plannedPlatform;
        this.remarks = remarks;
        this.via = via;
    }
}

/**
 * All known (to us) remark strings that aren't null
 *
 * @enum {string}
 */
export const RemarkCode = {
    Cancelled: "journey-cancelled",
    Alternative: "alternative-trip",
    Bicycles: "bicycle-conveyance",  // Bicycles conveyed
    NoBicycles: "no-bicycle-conveyance",
    WheelchairsSpace: "wheelchairs-space",  // space for wheelchairs
    BoardingRamp: "boarding-ramp",  // vehicle-mounted boarding ramp available
    SecondClassOnly: "2nd-class-only",
    BarrierFreeVehicle: "barrier-free-vehicle",
    PowerSockets: "power-sockets",
    AirConditioned: "air-conditioned",
    WiFi: "wifi",
    KomfortCheckin: "komfort-checkin",
    OnBoardRestaurant: "onboard-restaurant",
    Snacks: "snacks",  // snacks available for purchase

    // Longcodes from here
    ProductOrDirectionChanges: "text.journeystop.product.or.direction.changes.journey.message",

    // Shortcodes from here
    bg: "bg",  // Accessible vehicle (Behindertengerecht)
    FS: "FS",  // Limited times for bycicles (Fahrrad Sperrzeiten)
    SI: "SI",  // Barrier free access possible at some stations
    HM: "HM",  // Unclear, contains link
    mZ: "mZ",  // Can leave vehicle between stops after 19:00
    EA: "EA",  // Accessible vehicles
    GL: "GL",  // Limited transport for groups
    RC: "RC",  // Reservation possible
    OG: "OG",  // Toilets only partially accessible
    ZM: "ZM",  // Vehicle-mounted boarding ramp in the middle of the train
    FZ: "FZ",  // Tickets available in the train
    ER: "ER",  // Ramp in train
    eP: "eP",  // No MVV tickets (?)

    // This is an internal code to display errors,
    TransChampError: "transchamp-error"
}

/**
 * All known (to us) remark types that aren't null.
 *
 * @enum {string}
 */
export const RemarkType = {
    Hint: "hint",
    Status: "status",
}

export class Remark {
    /**
     * @param {RemarkType} type
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