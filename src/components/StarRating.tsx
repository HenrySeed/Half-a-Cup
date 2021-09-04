import { Star, StarBorder } from "@material-ui/icons/";
import * as React from "react";
import { useState } from "react";

export function StarRating({
    value,
    onChange,
}: {
    value: number;
    onChange: (val: number) => void;
}) {
    const [currentVal, setcurrentVal] = useState(value);

    function updateCurrentVal(value: number): void {
        setcurrentVal(value + 1);
    }

    function resetVal(): void {
        setcurrentVal(value);
    }

    const stars: JSX.Element[] = [];

    if (value > currentVal) {
        for (let activeI: number = 0; activeI < currentVal; activeI++) {
            stars.push(
                <Star
                    className="activeStar"
                    key={activeI}
                    onMouseEnter={() => updateCurrentVal(activeI)}
                    onMouseLeave={resetVal}
                    onClick={() => onChange(activeI + 1)}
                />
            );
        }
        for (let activeI: number = currentVal; activeI < value; activeI++) {
            stars.push(
                <StarBorder
                    style={{ color: "#f44336" }}
                    key={activeI}
                    onMouseEnter={() => updateCurrentVal(activeI)}
                    onMouseLeave={resetVal}
                    onClick={() => onChange(activeI + 1)}
                />
            );
        }
        for (let activeI: number = value; activeI < 5; activeI++) {
            stars.push(
                <StarBorder
                    className="star"
                    key={activeI}
                    onMouseEnter={() => updateCurrentVal(activeI)}
                    onMouseLeave={resetVal}
                    onClick={() => onChange(activeI + 1)}
                />
            );
        }
    } else {
        for (let activeI: number = 0; activeI < value; activeI++) {
            stars.push(
                <Star
                    className="activeStar"
                    key={activeI}
                    onMouseEnter={() => updateCurrentVal(activeI)}
                    onMouseLeave={resetVal}
                    onClick={() => onChange(activeI + 1)}
                />
            );
        }
        for (let activeI: number = value; activeI < currentVal; activeI++) {
            stars.push(
                <StarBorder
                    style={{ color: "#f44336" }}
                    key={activeI}
                    onMouseEnter={() => updateCurrentVal(activeI)}
                    onMouseLeave={resetVal}
                    onClick={() => onChange(activeI + 1)}
                />
            );
        }
        for (let activeI: number = currentVal; activeI < 5; activeI++) {
            stars.push(
                <StarBorder
                    className="star"
                    key={activeI}
                    onMouseEnter={() => updateCurrentVal(activeI)}
                    onMouseLeave={resetVal}
                    onClick={() => onChange(activeI + 1)}
                />
            );
        }
    }

    return <div>{stars}</div>;
}
