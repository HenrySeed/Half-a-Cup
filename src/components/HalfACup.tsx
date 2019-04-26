import * as React from "react";
import "./HalfACup.css";
import SearchBar from "./SearchBar";
import RecipeBrowser from "./RecipeBrowser";
import SavedRecipes from "./SavedRecipes";
import OpenRecipe from "./OpenRecipe";
import RecipeScroller from "../elements/RecipeScroller";

import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import {
    AppBar,
    IconButton,
    Toolbar,
    SwipeableDrawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Paper,
    ClickAwayListener
} from "@material-ui/core";
import Typography, { TypographyProps } from "@material-ui/core/Typography";

import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import { Favorite, Close, AccountCircle, Home } from "@material-ui/icons/";
import { Switch, Route, Link } from "react-router-dom";

import * as firebase from "firebase";
import "firebase/firestore";
import * as firebaseui from "firebaseui";

const style = (theme: Theme) => ({
    root: {
        width: "100%"
    },
    flex: {
        flex: 1,
        fontFamily: "Chivo"
    },
    menuButton: {
        marginLeft: -12
        // marginRight: 20,
    }
});

type PropsWithStyles = Props & WithStyles<"root" | "flex" | "menuButton">;

interface recipe {
    title: string;
    subtitle: string;
    tags: string[];
    ingredients: string[];
    steps: string[];
    rating: number;
}

interface User {
    displayName: string;
    email: string;
    profileImgUrl: string;
    uid: string;
}

export interface Props {
    color?: TypographyProps["color"];
}

export interface State {
    featuredRecipes: Map<string, recipe>;
    savedRecipes: Map<string, recipe>;
    savedRecipeIDs: string[];

    loadingSavedRecipes: boolean;
    loadingFeaturedRecipes: boolean;

    drawerOpen: boolean;
    SearchVal: string;
    loginOpen: boolean;
    user: User | undefined | null;
    loginMessage: string;
}

class HalfACup extends React.Component<Props & PropsWithStyles, State> {
    constructor(props: Props & PropsWithStyles) {
        super(props);
        this.state = {
            featuredRecipes: new Map<string, recipe>(),
            savedRecipeIDs: [],
            savedRecipes: new Map<string, recipe>(),

            loadingSavedRecipes: true,
            loadingFeaturedRecipes: true,

            drawerOpen: false,
            SearchVal: "",
            loginOpen: false,
            user: undefined,
            loginMessage: ""
        };

        this.onToggleFavourite = this.onToggleFavourite.bind(this);
        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
        this.onSearchClear = this.onSearchClear.bind(this);
        this.handleRecipeUpdate = this.handleRecipeUpdate.bind(this);

        // Firestpre congif
        const config = {
            apiKey: "AIzaSyAnlTaJufGESWh80ttA3C5s9ouyIw1J-1E",
            authDomain: "wholecup-72a6b.firebaseapp.com",
            databaseURL: "https://wholecup-72a6b.firebaseio.com",
            projectId: "wholecup-72a6b",
            storageBucket: "wholecup-72a6b.appspot.com",
            messagingSenderId: "51118699872"
        };
        firebase.initializeApp(config);

        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
    }

    componentWillMount(): void {
        this.setUpFirestoreAuth();
        this.getFeaturedRecipes();
    }

    setUpFirestoreAuth(): void {
        firebase.auth().onAuthStateChanged(
            user => {
                if (user) {
                    const _tempUser: User = {
                        displayName: "",
                        email: "",
                        profileImgUrl: "",
                        uid: ""
                    };

                    if (user.displayName !== null) {
                        _tempUser.displayName = user.displayName;
                    } else {
                        _tempUser.displayName = "USER";
                    }

                    if (user.email !== null) {
                        _tempUser.email = user.email;
                    }

                    if (user.photoURL !== null) {
                        _tempUser.profileImgUrl = user.photoURL;
                    }

                    if (user.uid !== null) {
                        _tempUser.uid = user.uid;
                    }
                    this.setState({
                        user: _tempUser
                    });
                    this.getSavedRecipes(_tempUser);
                } else {
                    // User is signed out.
                    this.setState({
                        user: null,
                        loadingSavedRecipes: false
                    });
                }
            },
            function(error: any): void {
                console.log(error);
            }
        );
    }

    async getSavedRecipes(_tempUser: User): Promise<void> {
        const thisClass = this;
        console.log("loading saved recipes");

        if (_tempUser) {
            await firebase
                .firestore()
                .collection("Users")
                .doc(_tempUser.uid)
                .get()
                .then(async doc => {
                    const data = doc.data();

                    if (data !== undefined) {
                        let savedR = [];
                        if (data.savedRecipes !== undefined) {
                            savedR = JSON.parse(data.savedRecipes);
                        }
                        this.setState({
                            savedRecipeIDs: savedR
                        });

                        for (const id of savedR) {
                            firebase
                                .firestore()
                                .collection("recipes")
                                .doc(id)
                                .get()
                                .then(function(doc: any): void {
                                    const _tempRecipe: recipe = doc.data();
                                    // set up ratings
                                    if (_tempRecipe.rating === undefined) {
                                        _tempRecipe.rating = 0;
                                    }
                                    thisClass.state.savedRecipes.set(
                                        id,
                                        _tempRecipe
                                    );
                                    thisClass.setState({
                                        loadingSavedRecipes: false
                                    });
                                })
                                .catch((e: any) => {
                                    console.log(
                                        "Error getting recipe document:",
                                        id,
                                        e
                                    );
                                });
                        }
                    } else {
                        console.log("No such document!");
                    }
                })
                .catch((e: any) => {
                    console.log("Error getting user document:", e);
                });
        }
    }

    getFeaturedRecipes(): void {
        var db = firebase.firestore();
        const featuredRecipeIDs = [
            "Refried_Beans",
            "Pumpkin-Pie",
            "Throw-it-together_Self-crusting_Pie",
            "Apple_Crumble",
            "Cannelloni",
            "Apple_Pie",
            "Pumpkin_Soup",
            "Brocolli_Salad",
            "Chocolate_Caramel_Cake"
        ];
        const thisClass = this;

        for (const recipeID of featuredRecipeIDs) {
            db.collection("recipes")
                .doc(recipeID)
                .get()
                .then(function(doc: any): void {
                    const _tempRecipe: recipe = doc.data();
                    // set up ratings
                    if (_tempRecipe.rating === undefined) {
                        _tempRecipe.rating = 0;
                    }
                    thisClass.state.featuredRecipes.set(recipeID, _tempRecipe);
                    thisClass.setState({
                        loadingFeaturedRecipes: false
                    });
                });
        }
    }

    /**
     *
     * @memberof WholeCup
     */
    componentDidMount(): void {
        if (!this.state.user) {
            var uiConfig = {
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ]
            };

            var ui: any;

            // Initialize the FirebaseUI Widget using Firebase.
            ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start("#firebaseui-auth-container", uiConfig);
        }
    }

    handleTagClick(tag: string): void {
        this.setState({
            SearchVal: tag
        });
    }

    onSearchClear(): void {
        this.setState({
            SearchVal: ""
        });
    }

    toggleDrawer(status: boolean): void {
        this.setState({
            drawerOpen: status
        });
    }

    toggleLoginModal(status: boolean): void {
        this.setState({
            loginOpen: status
        });

        // reset login message
        if (status === false) {
            this.setState({
                loginMessage: ""
            });
        }
    }

    onLogout(): void {
        if (this.state.user) {
            console.log(`logging out user: ${this.state.user.uid}`);
            firebase
                .auth()
                .signOut()
                .then(() => {
                    window.location.reload(false);
                });
        } else {
            console.log("No user ");
            console.log(this.state.user);
        }
    }

    onToggleFavourite(key: string, val: boolean): void {
        if (this.state.user) {
            console.log(`Toggling ${key} to ${val}`);
            let savedRecipeIDs: string[] = [];
            if (val === true) {
                savedRecipeIDs = this.state.savedRecipeIDs.concat([key]);
            } else {
                savedRecipeIDs = this.state.savedRecipeIDs;
                savedRecipeIDs.splice(savedRecipeIDs.indexOf(key), 1);
            }

            this.setState({
                savedRecipeIDs: savedRecipeIDs
            });
            // save to firestore
            firebase
                .firestore()
                .collection("Users")
                .doc(this.state.user.uid)
                .set({
                    savedRecipes: JSON.stringify(savedRecipeIDs)
                });

            const newSavedRecipes: Map<string, recipe> = new Map<
                string,
                recipe
            >();

            // update the savedRecipes array
            for (const id of savedRecipeIDs) {
                firebase
                    .firestore()
                    .collection("recipes")
                    .doc(id)
                    .get()
                    .then(function(doc: any): void {
                        if (doc.exists) {
                            const _tempRecipe: recipe = doc.data();
                            // set up ratings
                            if (_tempRecipe.rating === undefined) {
                                _tempRecipe.rating = 0;
                            }
                            newSavedRecipes.set(id, _tempRecipe);
                        }
                    });
            }
            this.setState({
                savedRecipes: newSavedRecipes
            });
        } else {
            this.setState({
                loginOpen: true,
                loginMessage: "You need to be logged in to favourite recipes."
            });
        }
    }

    handleRecipeUpdate(newRecipe: recipe, key: string): void {
        console.log(`Saving Recipe: ${key} with data:`);
        console.log(newRecipe);

        if (this.state.user) {
            if (this.state.user.uid === "bWcWTtHgkJaw0RK2EPqIV9KKUfw2") {
                try {
                    // save to firestore
                    firebase
                        .firestore()
                        .collection("recipes")
                        .doc(key)
                        .set({
                            ingredients: newRecipe.ingredients,
                            steps: newRecipe.steps,
                            tags: newRecipe.tags,
                            title: newRecipe.title,
                            subtitle: newRecipe.subtitle,
                            rating: newRecipe.rating
                        });
                } catch (e) {
                    console.log("Saving Recipe failed:", e);
                }
            } else {
                console.log("You shouldnt be able to do that ...");
            }
        } else {
            console.log("You need to be logged in to edit recipes");
        }
    }

    render(): JSX.Element {
        let loginPanel: JSX.Element = (
            <Button
                onClick={() => this.toggleLoginModal(true)}
                style={{ color: "#FFFFFF" }}
            >
                Login
            </Button>
        );

        if (this.state.user) {
            loginPanel = (
                <Button onClick={this.onLogout} style={{ color: "#FFFFFF" }}>
                    Log out
                </Button>
            );
        }

        // the login window
        const loginModal: JSX.Element = (
            <div
                className="modalContainer"
                style={!this.state.loginOpen ? { visibility: "hidden" } : {}}
            >
                <ClickAwayListener
                    onClickAway={() => this.toggleLoginModal(false)}
                >
                    <Paper className="loginModal">
                        <Typography
                            variant="title"
                            id="modal-title"
                            style={{ display: "inline-block" }}
                        >
                            Login
                        </Typography>
                        <IconButton
                            className="close"
                            onClick={() => this.toggleLoginModal(false)}
                        >
                            <Close />
                        </IconButton>
                        {this.state.loginMessage === "" ? (
                            <span />
                        ) : (
                            <div>
                                <br />
                                <em>{this.state.loginMessage}</em>
                                <br />
                                <br />
                            </div>
                        )}
                        <div
                            id="firebaseui-auth-container"
                            ref="loginModalRef"
                        />
                    </Paper>
                </ClickAwayListener>
            </div>
        );

        const sideList = (
            <div>
                <List>
                    <ListItem>
                        <Typography
                            variant="title"
                            color="inherit"
                            className={this.props.classes.flex}
                        >
                            Half a Cup
                        </Typography>
                        <IconButton
                            onClick={() => this.setState({ drawerOpen: false })}
                            className={this.props.classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                        >
                            <Close />
                        </IconButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <Link to="/">
                        <ListItem>
                            <ListItemIcon className="whiteText">
                                <Home />
                            </ListItemIcon>
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography style={{ color: "#FFFFFF" }}>
                                        Home
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Link>
                    <Link to="/recipes">
                        <ListItem>
                            <ListItemIcon className="whiteText">
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography style={{ color: "#FFFFFF" }}>
                                        Browse all Recipes
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Link>
                    <Link to="/favourite">
                        <ListItem>
                            <ListItemIcon className="whiteText">
                                <Favorite />
                            </ListItemIcon>
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography style={{ color: "#FFFFFF" }}>
                                        Your Favourite Recipes
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon className="whiteText">
                            <AccountCircle />
                        </ListItemIcon>
                        {loginPanel}
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            onClick={() => this.toggleDrawer(true)}
                            className={this.props.classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="title"
                            color="inherit"
                            className={this.props.classes.flex}
                        >
                            <Link to="/">Half a Cup</Link>
                        </Typography>
                        {/* <SearchBar
              value={this.state.SearchVal}
              onSearchClear={this.onSearchClear}
              recipes={this.state.recipes}
            /> */}
                    </Toolbar>
                </AppBar>
                {loginModal}
                <SwipeableDrawer
                    open={this.state.drawerOpen}
                    onClose={() => this.toggleDrawer(false)}
                    onOpen={() => this.toggleDrawer(true)}
                >
                    <div
                        className="sideBar"
                        tabIndex={0}
                        role="button"
                        onClick={() => this.toggleDrawer(false)}
                        onKeyDown={() => this.toggleDrawer(false)}
                    >
                        {sideList}
                    </div>
                </SwipeableDrawer>

                <Switch>
                    <Route
                        exact
                        path="/recipes"
                        render={() => (
                            <RecipeBrowser
                                title="All Recipes"
                                onToggleFavourite={this.onToggleFavourite}
                                favRecipes={this.state.savedRecipeIDs}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <div
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    marginTop: "25px",
                                    marginBottom: "30px",
                                    maxWidth: "1200px",
                                    width: "90%"
                                }}
                            >
                                {this.state.savedRecipeIDs.length === 0 &&
                                !this.state.loadingSavedRecipes ? (
                                    <div
                                        style={{
                                            marginLeft: "5%",
                                            flexWrap: "wrap",
                                            justifyContent: "space-around",
                                            overflow: "hidden",
                                            marginTop: "30px"
                                        }}
                                    >
                                        <Typography
                                            variant="title"
                                            color="inherit"
                                            style={{ marginBottom: "10px" }}
                                        >
                                            Your favourite recipes
                                        </Typography>
                                        <div
                                            style={{
                                                marginLeft: "5%",
                                                marginTop: "20px",
                                                color: "gray"
                                            }}
                                        >
                                            Favourite some recipes to see them
                                            here.
                                        </div>
                                    </div>
                                ) : (
                                    <RecipeScroller
                                        title="Your favourite recipes"
                                        recipes={this.state.savedRecipes}
                                        favRecipes={this.state.savedRecipeIDs}
                                        onToggleFavourite={
                                            this.onToggleFavourite
                                        }
                                        maximum={5}
                                        seeMoreLink="/favourite"
                                        isLoading={
                                            this.state.loadingSavedRecipes
                                        }
                                    />
                                )}
                                <RecipeScroller
                                    title="Browse all recipes"
                                    recipes={this.state.featuredRecipes}
                                    favRecipes={this.state.savedRecipeIDs}
                                    onToggleFavourite={this.onToggleFavourite}
                                    maximum={5}
                                    seeMoreLink="/recipes"
                                    isLoading={
                                        this.state.loadingFeaturedRecipes
                                    }
                                />
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path="/favourite"
                        render={() => (
                            <SavedRecipes
                                recipes={this.state.savedRecipes}
                                onToggleFavourite={this.onToggleFavourite}
                            />
                        )}
                    />
                    <Route
                        path="/recipes/:key"
                        render={({ match }) => {
                            if (match.params.key !== undefined) {
                                return (
                                    <OpenRecipe
                                        user={this.state.user}
                                        onRecipeSave={this.handleRecipeUpdate}
                                        onToggleFavourite={
                                            this.onToggleFavourite
                                        }
                                        recipeKey={match.params.key}
                                        favRecipes={this.state.savedRecipeIDs}
                                        onTagClick={this.handleTagClick}
                                    />
                                );
                            } else {
                                return <span />;
                            }
                        }}
                    />
                </Switch>
            </div>
        );
    }
}

export default withStyles(style)<Props>(HalfACup);
