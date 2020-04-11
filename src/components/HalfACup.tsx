import * as React from "react";
import "./HalfACup.css";
import SearchBar from "./SearchBar";
import RecipeBrowser from "./RecipeBrowser";
import SavedRecipes from "./SavedRecipes";
import OpenRecipe from "./OpenRecipe";
import RecipeScroller from "../elements/RecipeScroller";
import {
  Theme,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme,
} from "@material-ui/core/styles";
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
  ClickAwayListener,
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
    width: "100%",
  },
  flex: {
    fontFamily: "Chivo",
    marginLeft: "10px",
    marginRight: "20px",
  },
  menuButton: {
    marginLeft: "-12px",
    marginTop: "8px",
    // marginRight: 20,
  },
  sideBarClose: {
    marginLeft: "75px",
  },
});

type PropsWithStyles = Props &
  WithStyles<"root" | "flex" | "menuButton" | "sideBarClose">;

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

export interface Props extends WithTheme {
  color?: TypographyProps["color"];
}

export interface State {
  savedRecipeIDs: string[];
  allRecipeNames: Map<string, string>;
  allRecipeTags: Map<string, string[]>;

  isLoading: boolean;
  drawerOpen: boolean;
  SearchVal: string;
  loginOpen: boolean;
  user: User | undefined | null;
  loginMessage: string;
}

class HalfACup extends React.Component<Props & PropsWithStyles, State> {
  featuredRecipeIDs: string[] = [
    "Refried_Beans",
    "Pumpkin-Pie",
    "Throw-it-together_Self-crusting_Pie",
    "Apple_Crumble",
    "Cannelloni",
    "Apple_Pie",
    "Pumpkin_Soup",
    "Brocolli_Salad",
    "Chocolate_Caramel_Cake",
  ];

  constructor(props: Props & PropsWithStyles) {
    super(props);
    this.state = {
      savedRecipeIDs: [],
      allRecipeNames: new Map<string, string>(),
      allRecipeTags: new Map<string, string[]>(),

      isLoading: true,
      drawerOpen: false,
      SearchVal: "",
      loginOpen: false,
      user: undefined,
      loginMessage: "",
    };

    this.onToggleFavourite = this.onToggleFavourite.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.onSearchClear = this.onSearchClear.bind(this);
    this.handleRecipeUpdate = this.handleRecipeUpdate.bind(this);
    this.handleSearchValChange = this.handleSearchValChange.bind(this);

    // Firestpre congif
    const config = {
      apiKey: "AIzaSyAnlTaJufGESWh80ttA3C5s9ouyIw1J-1E",
      authDomain: "wholecup-72a6b.firebaseapp.com",
      databaseURL: "https://wholecup-72a6b.firebaseio.com",
      projectId: "wholecup-72a6b",
      storageBucket: "wholecup-72a6b.appspot.com",
      messagingSenderId: "51118699872",
    };
    firebase.initializeApp(config);

    const firestore = firebase.firestore();
    firestore.settings({ timestampsInSnapshots: true });
  }

  componentWillMount(): void {
    this.setState({ isLoading: true });
    this.getAllRecipeNames();
    this.setUpFirestoreAuth();
  }

  handleSearchValChange(str: string): void {
    this.setState({ SearchVal: str });
  }

  getAllRecipeNames(): void {
    const thisClass = this;
    firebase
      .firestore()
      .collection("recipes")
      .get()
      .then(function (querySnapshot: any): void {
        querySnapshot.forEach(function (doc: any): void {
          const recipe = doc.data();

          // we need to trim whitespace off tags
          const tags = [];
          for (const tag of recipe.tags) {
            tags.push(tag.trim());
          }

          thisClass.state.allRecipeNames.set(doc.id, recipe.title);
          thisClass.state.allRecipeTags.set(
            doc.id,
            recipe.title.split(" ").concat(tags)
          );

          thisClass.setState({
            isLoading: false,
          });
        });
      });
  }

  setUpFirestoreAuth(): void {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          const _tempUser: User = {
            displayName: "",
            email: "",
            profileImgUrl: "",
            uid: "",
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
            user: _tempUser,
          });
          this.getSavedRecipes(_tempUser);
        } else {
          // User is signed out.
          this.setState({
            user: null,
          });
        }
      },
      function (error: any): void {
        console.log(error);
      }
    );
  }

  async getSavedRecipes(_tempUser: User): Promise<void> {
    if (_tempUser) {
      await firebase
        .firestore()
        .collection("Users")
        .doc(_tempUser.uid)
        .get()
        .then(async (doc) => {
          const data = doc.data();

          if (data !== undefined) {
            let savedR = [];
            if (data.savedRecipes !== undefined) {
              savedR = JSON.parse(data.savedRecipes);
            }
            this.setState({
              savedRecipeIDs: savedR,
            });
          } else {
            console.log("No such document!");
          }
        })
        .catch((e: any) => {
          console.log("Error getting user document:", e);
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
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
      };

      var ui: any;

      // Initialize the FirebaseUI Widget using Firebase.
      ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  }

  handleTagClick(tag: string): void {
    this.setState({
      SearchVal: tag,
    });
  }

  onSearchClear(): void {
    this.setState({
      SearchVal: "",
    });
  }

  toggleDrawer(status: boolean): void {
    this.setState({
      drawerOpen: status,
    });
  }

  toggleLoginModal(status: boolean): void {
    this.setState({
      loginOpen: status,
    });

    // reset login message
    if (status === false) {
      this.setState({
        loginMessage: "",
      });
    }
  }

  onLogout(): void {
    if (this.state.user) {
      // console.log(`logging out user: ${this.state.user.uid}`);
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
      // console.log(`Toggling ${key} to ${val}`);
      let savedRecipeIDs: string[] = [];
      if (val === true) {
        savedRecipeIDs = this.state.savedRecipeIDs.concat([key]);
      } else {
        savedRecipeIDs = this.state.savedRecipeIDs;
        savedRecipeIDs.splice(savedRecipeIDs.indexOf(key), 1);
      }

      this.setState({
        savedRecipeIDs: savedRecipeIDs,
      });
      // save to firestore
      firebase
        .firestore()
        .collection("Users")
        .doc(this.state.user.uid)
        .set({
          savedRecipes: JSON.stringify(savedRecipeIDs),
        });
    } else {
      this.setState({
        loginOpen: true,
        loginMessage: "You need to be logged in to favourite recipes.",
      });
    }
  }

  handleRecipeUpdate(newRecipe: recipe, key: string): void {
    // console.log(`Saving Recipe: ${key} with data:`);
    // console.log(newRecipe);

    if (this.state.user) {
      if (this.state.user.uid === "bWcWTtHgkJaw0RK2EPqIV9KKUfw2") {
        try {
          // save to firestore
          firebase.firestore().collection("recipes").doc(key).set({
            ingredients: newRecipe.ingredients,
            steps: newRecipe.steps,
            tags: newRecipe.tags,
            title: newRecipe.title,
            subtitle: newRecipe.subtitle,
            rating: newRecipe.rating,
          });
        } catch (e) {
          console.log("Saving Recipe failed:", e);
        }
      } else {
        // console.log("You shouldnt be able to do that ...");
      }
    } else {
      // console.log("You need to be logged in to edit recipes");
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

    const savedRecipeNames = new Map<string, string>();

    for (const key of this.state.savedRecipeIDs) {
      const name = this.state.allRecipeNames.get(key);
      if (name !== undefined) {
        savedRecipeNames.set(key, name);
      }
    }

    // the login window
    const loginModal: JSX.Element = (
      <div
        className="modalContainer"
        style={!this.state.loginOpen ? { visibility: "hidden" } : {}}
      >
        <ClickAwayListener onClickAway={() => this.toggleLoginModal(false)}>
          <Paper className="loginModal">
            <div
              className="modal-header"
              style={{ backgroundColor: this.props.theme.palette.primary.main }}
            >
              <Typography
                variant="title"
                id="modal-title"
                style={{ display: "inline-block", color: "#FFFFFF" }}
              >
                Login
              </Typography>
              <IconButton
                className="close"
                onClick={() => this.toggleLoginModal(false)}
                style={{ color: "#FFFFFF" }}
              >
                <Close />
              </IconButton>
            </div>
            <div className="login-container">
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
              <div id="firebaseui-auth-container" ref="loginModalRef" />
            </div>
          </Paper>
        </ClickAwayListener>
      </div>
    );

    const sideList = (
      <div>
        <List>
          <ListItem>
            <img className="logo" src="../../../halfacup_logo.svg" />
            <IconButton
              onClick={() => this.setState({ drawerOpen: false })}
              className={this.props.classes.sideBarClose}
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
                  <Typography style={{ color: "#FFFFFF" }}>Home</Typography>
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
      <span>
        <div style={{ minHeight: "100vh" }}>
          <AppBar position="sticky">
            <Toolbar className="toolbar">
              <IconButton
                onClick={() => this.toggleDrawer(true)}
                className={this.props.classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>

              <Link to="/">
                <img className="logo" src="../../../halfacup_logo.svg" />
              </Link>
              <SearchBar
                onSearchValChange={this.handleSearchValChange}
                value={this.state.SearchVal}
                onSearchClear={this.onSearchClear}
                recipeNames={this.state.allRecipeNames}
                allRecipeTags={this.state.allRecipeTags}
              />
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
                  favRecipes={this.state.savedRecipeIDs}
                  allRecipeNames={this.state.allRecipeNames}
                  onToggleFavourite={this.onToggleFavourite}
                  isLoading={this.state.isLoading}
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
                    width: "90%",
                  }}
                >
                  {this.state.savedRecipeIDs.length === 0 &&
                  !this.state.isLoading ? (
                    <div
                      style={{
                        marginLeft: "5%",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                        overflow: "hidden",
                        marginTop: "30px",
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
                          color: "#444",
                        }}
                      >
                        Favourite some recipes to see them here.
                      </div>
                    </div>
                  ) : (
                    <RecipeScroller
                      title="Your favourite recipes"
                      recipeNames={savedRecipeNames}
                      favRecipes={this.state.savedRecipeIDs}
                      onToggleFavourite={this.onToggleFavourite}
                      maximum={5}
                      seeMoreLink="/favourite"
                      isLoading={this.state.isLoading}
                    />
                  )}
                  <RecipeScroller
                    title="Browse all recipes"
                    recipeNames={this.state.allRecipeNames}
                    favRecipes={this.state.savedRecipeIDs}
                    onToggleFavourite={this.onToggleFavourite}
                    maximum={14}
                    seeMoreLink="/recipes"
                    isLoading={this.state.isLoading}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/favourite"
              render={() => (
                <SavedRecipes
                  recipeNames={savedRecipeNames}
                  onToggleFavourite={this.onToggleFavourite}
                  isLoading={this.state.isLoading}
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
                      onToggleFavourite={this.onToggleFavourite}
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
        <footer>
          <div className="footer-container">
            <img className="logo" src="../../../halfacup_logo.svg" />
            <br />© Henry Seed {new Date().getFullYear()}
          </div>
        </footer>
      </span>
    );
  }
}

// export default withStyles(style)<Props>(HalfACup);

const HalfACupWTheme = withTheme()(HalfACup); // 3
export default withStyles(style)<Props>(HalfACupWTheme as any);
