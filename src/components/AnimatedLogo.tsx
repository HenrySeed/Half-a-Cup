import { Typography } from "@material-ui/core";
import knife from "../res/SVG/knife.svg";
import bread_knife from "../res/SVG/bread_knife.svg";
import rolling_pin from "../res/SVG/rolling_pin.svg";
import spatula from "../res/SVG/spatula.svg";
import spoon from "../res/SVG/spoon.svg";
import tongs from "../res/SVG/tongs.svg";
import { useEffect, useState } from "react";
import "./AnimatedLogo.css";

export function AnimatedLogo() {
    const logos = [
        knife,
        bread_knife,
        rolling_pin,
        spatula,
        spoon,
        tongs,
        knife,
        bread_knife,
        rolling_pin,
        spatula,
        spoon,
        tongs,
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index + 1) % logos.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [index, logos.length]);

    return (
        <span>
            <Typography className="logo" variant="h1">
                Half a Cup
            </Typography>
            <div
                style={{
                    width: "90%",
                    maxWidth: "318px",
                    height: "80px",
                    overflow: "hidden",
                    float: "right",
                    position: "relative",
                }}
            >
                {logos.map((val, i) => (
                    <img
                        alt="logo"
                        key={i}
                        src={val}
                        style={{
                            width: "100%",
                            position: "absolute",
                            left: 0,
                            top: `${(i - index) * 80}px`,
                            transition: "0.5s",
                        }}
                    />
                ))}
            </div>
        </span>
    );
}
