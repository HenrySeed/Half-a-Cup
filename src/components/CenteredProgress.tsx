import { CircularProgress } from "@material-ui/core";
import React from "react";

export function CenteredProgress({ style }: { style: React.CSSProperties }) {
    return (
        <div style={{ width: "100%", ...style }}>
            <CircularProgress
                style={{
                    color: style.color || "inherit",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                }}
            />
        </div>
    );
}
