import { useState } from "react";
import { getRandFromArray } from "../utils";

/**
 * Randomly chooses a tagline and returns it
 * @export
 * @returns {string}
 */
export function useTagline(): string {
    const footerTaglines = [
        "Made with indecisiveness in",
        "Sent to you over the internet, from",
        "Little packets of tastiness, from",
        "Easier cooking, from",
        "A pinch of love, from",
        "Handled with care, in",
    ];
    const [tagLine] = useState(getRandFromArray(footerTaglines));

    return tagLine;
}
