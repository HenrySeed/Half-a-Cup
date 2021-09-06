import { AppBar, Grid, Toolbar, Typography } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import { LoginButton } from "./components/LoginButton";
import { NewRecipeButton } from "./components/NewRecipeButton";
import { useTagline } from "./hooks/useTagline";
import { HACUser } from "./modules";
import nzMap from "./res/SVG/nz.svg";
import { EditRecipe } from "./views/EditRecipe";
import { HomeView } from "./views/HomeView";
import { RecipeView } from "./views/RecipeView";
import { SearchView } from "./views/SearchView";

function App() {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#f44336",
            },
            secondary: {
                main: "#222222",
            },
        },
        typography: {
            h1: {
                fontSize: "4rem",
                fontWeight: 600,
            },
            h2: {
                fontSize: "3rem",
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
    });

    const tagLine = useTagline();
    const [user, setUser] = useState<HACUser | null>(null);

    let location = useLocation();

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
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        {/* <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            style={{ marginRight: "10px" }}
                        >
                            <Menu />
                        </IconButton> */}
                        <Link to="/" style={{ flexGrow: 1 }}>
                            <Typography variant="h6">
                                {location?.pathname !== "/" && "Half a Cup"}
                            </Typography>
                        </Link>
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
                    <Route path="/search/:searchPhrase">
                        <SearchView user={user} />
                    </Route>
                    <Route path="/">
                        <HomeView user={user} />
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
                            © Henry Seed 2021
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
