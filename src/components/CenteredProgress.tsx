import { CircularProgress, useTheme } from "@material-ui/core";
import React from "react";

export function CenteredProgress({ style }: { style: React.CSSProperties }) {
    const theme = useTheme();
    return (
        <div style={{ width: "100%", ...style }}>
            <CircularProgress
                style={{
                    color: style.color || theme.palette.text.primary,
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                }}
            />
        </div>
    );
}
