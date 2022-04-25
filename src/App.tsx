import {
    AppBar,
    Grid,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useMemo, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import { LoginButton } from "./components/LoginButton";
import { NewRecipeButton } from "./components/NewRecipeButton";
import { SearchBox } from "./components/SearchBox";
import { useTagline } from "./hooks/useTagline";
import { HACUser } from "./modules";
import nzMap from "./res/SVG/nz.svg";
import knifeLogo from "./res/SVG/logo_knife.svg";
import { EditRecipe } from "./views/EditRecipe";
import { HomeView } from "./views/HomeView";
import { RecipeView } from "./views/RecipeView";
import { SearchView } from "./views/SearchView";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";
import { Brightness2, WbSunny } from "@material-ui/icons";
import { PageMissing } from "./components/PageMissing";

function App() {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [darkMode, setDarkMode] = useState(false);
    const tagLine = useTagline();
    const [user, setUser] = useState<HACUser | null>(null);
    const [searchData, setSearchData] = useState<Map<string, string> | null>(
        null
    );
    let location = useLocation();

    useEffect(() => {
        if (user) {
            setDarkMode(user.darkMode);
        } else {
            setDarkMode(prefersDarkMode);
        }
    }, [prefersDarkMode, user]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    type: darkMode ? "dark" : "light",
                    primary: {
                        main: "#f44336",
                    },
                    secondary: {
                        main: "#222222",
                    },
                    background: {
                        default: darkMode ? "#111" : "#FFF",
                        paper: darkMode ? "#111" : "#FFF",
                    },
                },
                typography: {
                    h1: {
                        fontSize: "4rem",
                        fontWeight: 600,
                    },
                    h2: {
                        fontSize: "2.5rem",
                        fontWeight: 500,
                    },
                    h3: {
                        fontSize: "1.7rem",
                        fontWeight: 500,
                    },
                },
                props: {
                    MuiButton: {
                        variant: "outlined",
                    },
                    MuiTextField: {
                        color: "secondary",
                        variant: "outlined",
                    },
                },
                overrides: {
                    MuiPaper: {
                        rounded: {
                            borderRadius: "10px",
                        },
                    },
                    MuiCardActions: {
                        root: {
                            padding: "16px",
                        },
                    },
                },
            }),
        [darkMode]
    );

    useEffect(() => {
        getDocs(collection(db, "searchData")).then((querySnapshot) => {
            const newMap = new Map<string, string>();
            querySnapshot.forEach((doc) => {
                newMap.set(doc.id, doc.data().data);
            });
            setSearchData(newMap);
        });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleUserChange(user: HACUser | null) {
        setUser(user);
    }

    return (
        <ThemeProvider theme={theme}>
            <div
                className="App"
                style={{ backgroundColor: theme.palette.background.default }}
            >
                <AppBar position="static">
                    <Toolbar>
                        <Link to="/" style={{ flexGrow: 1 }}>
                            {location?.pathname !== "/" && (
                                <span>
                                    <img
                                        alt="logo"
                                        src={knifeLogo}
                                        style={{
                                            width: "120px",
                                            marginTop: "15px",
                                        }}
                                    />
                                </span>
                            )}
                        </Link>
                        <SearchBox />
                        {user && (
                            <Tooltip
                                title={darkMode ? "Light Mode" : "Dark Mode"}
                            >
                                <IconButton
                                    onClick={() => {
                                        user?.saveTheme(
                                            darkMode ? "LIGHT" : "DARK"
                                        );
                                        setDarkMode(!darkMode);
                                    }}
                                    style={{ color: "white" }}
                                >
                                    {darkMode ? <WbSunny /> : <Brightness2 />}
                                </IconButton>
                            </Tooltip>
                        )}
                        <NewRecipeButton user={user} />
                        <LoginButton
                            user={user}
                            onUserChange={handleUserChange}
                        />
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route path="/edit/:id">
                        <EditRecipe user={user} />
                    </Route>
                    <Route path="/recipe/:id">
                        <RecipeView user={user} />
                    </Route>
                    <Route path="/search/:searchVal">
                        <SearchView user={user} searchData={searchData} />
                    </Route>
                    <Route exact path="/">
                        <HomeView user={user} />
                    </Route>
                    <Route>
                        <PageMissing />
                    </Route>
                </Switch>
            </div>

            <footer>
                <Grid
                    container
                    className="footerContainer"
                    justifyContent="space-around"
                >
                    <Grid item style={{ padding: "10px", width: "311px" }}>
                        <Typography variant="h3">Half a Cup</Typography>
                        <Typography
                            variant="body1"
                            style={{ opacity: 0.7, paddingLeft: "2px" }}
                            gutterBottom
                        >
                            <em>Helping to make cooking simpler</em>
                        </Typography>
                        <br />
                        <Typography
                            variant="body1"
                            gutterBottom
                            style={{ opacity: 0.5 }}
                        >
                            © Henry Seed 2022
                        </Typography>
                    </Grid>
                    <Grid item style={{ padding: "10px" }}>
                        <Grid container style={{ marginTop: "10px" }}>
                            <Grid item>
                                <span style={{ textAlign: "right" }}>
                                    <Typography variant="body2" gutterBottom>
                                        {tagLine}
                                    </Typography>
                                    <Typography variant="h6">
                                        Christchurch,
                                        <br />
                                        Aotearoa
                                    </Typography>
                                </span>
                            </Grid>
                            <Grid item>
                                <img
                                    alt=""
                                    src={nzMap}
                                    style={{
                                        height: "70px",
                                        marginLeft: "10px",
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </footer>
        </ThemeProvider>
    );
}

export default App;
