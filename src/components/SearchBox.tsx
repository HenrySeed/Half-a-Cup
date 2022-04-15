import { ClickAwayListener, IconButton, makeStyles } from "@material-ui/core";
import { Cancel, Search } from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import useWindowDimensions from "../hooks/useWindowDimensions";

const dimWhite = "rgba(0,0,0,0.3)";
const useStyles = makeStyles({
    wrapperFocus: {
        background: "white !important",
    },
    wrapper: {
        background: "rgba(0,0,0,0.1)",
        padding: "10px",
        borderRadius: "10px",
        width: "fit-content",
        verticalAlign: "middle",
        cursor: "",
        display: "inline-block",
        marginRight: "10px",
        top: "100px",
    },
    input: {
        color: dimWhite,
        background: "none",
        border: "none",
        outline: "none",
        marginTop: "3px",
        fontSize: "13pt",
        marginLeft: "5px",
    },
    inputFocussed: {
        color: "black !important",
    },

    icon: {
        color: dimWhite,
        verticalAlign: "middle",
    },
    iconFocussed: {
        color: "black !important",
    },
    mobileSearch: {
        display: "inherit",
        position: "absolute",
        top: "6px",
        left: "3%",
        width: "90%",
        zIndex: 1000,
    },
});

export function SearchBox() {
    const [searchVal, setSearchVal] = useState("");
    const classes = useStyles();
    const [focussed, setFocussed] = useState(false);
    const inputEl = useRef<any>(null);
    const { width } = useWindowDimensions();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setSearchVal("");
        setFocussed(false);
    }, [location]);

    useEffect(() => {
        if (focussed) {
            inputEl.current.focus();
        } else {
            inputEl.current.blur();
        }
    }, [focussed]);

    return (
        <ClickAwayListener onClickAway={() => setFocussed(false)}>
            <div
                onClick={() => setFocussed(true)}
                style={{ marginTop: "5px", display: "inline-block" }}
            >
                <div
                    className={`${classes.wrapper} ${
                        focussed ? classes.wrapperFocus : ""
                    } ${width < 600 && focussed ? classes.mobileSearch : ""}`}
                    style={{
                        display: width < 600 && !focussed ? "none" : "inherit",
                    }}
                    onClick={() => setFocussed(true)}
                >
                    <Search
                        className={`${focussed ? classes.iconFocussed : ""} ${
                            classes.icon
                        }`}
                    />
                    <input
                        className={`${focussed ? classes.inputFocussed : ""} ${
                            classes.input
                        }`}
                        style={{
                            width:
                                focussed && width < 600
                                    ? "calc(100% - 60px)"
                                    : undefined,
                        }}
                        value={
                            searchVal !== "" || focussed ? searchVal : "Search"
                        }
                        onMouseDown={(e) => {
                            e.stopPropagation();
                        }}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder={focussed ? "Search" : ""}
                        ref={inputEl}
                        type="text"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearchVal("");
                                history.push(
                                    `/search/${encodeURIComponent(searchVal)}`
                                );
                            }
                        }}
                    />
                    {width < 600 && (
                        <Cancel
                            onClick={(e) => {
                                setFocussed(false);
                                e.stopPropagation();
                            }}
                            style={{
                                color: "black",
                                verticalAlign: "middle",
                                marginTop: "-3px",
                            }}
                        />
                    )}
                </div>
                <span style={{ display: width > 600 ? "none" : "inherit" }}>
                    <IconButton
                        style={{ color: "white" }}
                        onClick={() => setFocussed(true)}
                    >
                        <Search />
                    </IconButton>
                </span>
            </div>
        </ClickAwayListener>
    );
}
