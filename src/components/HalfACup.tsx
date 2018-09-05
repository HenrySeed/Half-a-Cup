import * as React from "react";
import "./HalfACup.css";
import SearchBar from "./SearchBar";
import RecipeBrowser from "./RecipeBrowser";
import SavedRecipes from "./SavedRecipes";
import OpenRecipe from "./OpenRecipe";

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
    Modal,
    Button,
    Paper
} from "@material-ui/core";
import Typography, { TypographyProps } from "@material-ui/core/Typography";

import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/List';
import { Favorite, Close, AccountCircle } from '@material-ui/icons/';
import { Switch, Route, Link } from "react-router-dom";
import { detect } from "detect-browser";

import * as firebase from 'firebase';
import "firebase/firestore";
import * as firebaseui from 'firebaseui';


const style = (theme: Theme) => ({
    root: {
        width: "100%",
    },
    flex: {
        flex: 1,
        fontFamily: 'Chivo'
    },
    menuButton: {
        marginLeft: -12,
        // marginRight: 20,
    },
});


type PropsWithStyles = Props & WithStyles<"root" | "flex" | "menuButton">;

interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}

interface User {
    displayName: string,
    email: string,
    profileImgUrl: string,
    uid: string
}

export interface Props {
    color?: TypographyProps["color"];
}

export interface State {
    recipes: Map<string, recipe>
    drawerOpen: boolean,
    SearchVal: string,
    savedRecipes: string[],
    loginOpen: boolean,
    user: User | undefined
}


class HalfACup extends React.Component<Props & PropsWithStyles, State> {

    ui: firebaseui.auth.AuthUI;

    constructor(props: Props & PropsWithStyles) {
        super(props);
        this.state = {
            recipes: new Map<string, recipe>(),
            drawerOpen: false,
            SearchVal: "",
            savedRecipes: [],
            loginOpen: false,
            user: undefined
        };

        this.onToggleFavourite = this.onToggleFavourite.bind(this)
        this.toggleLoginModal = this.toggleLoginModal.bind(this)
        this.onLogout = this.onLogout.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this)
        this.onSearchClear = this.onSearchClear.bind(this)

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
        firestore.settings({timestampsInSnapshots: true});
        
    }

    initApp(): void {
        
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const _tempUser: User = {
                    displayName: "",
                    email: "",
                    profileImgUrl: "",
                    uid: ""
                }

                if(user.displayName !== null) {_tempUser.displayName = user.displayName} 
                else{ _tempUser.displayName = "USER" }

                if(user.email !== null) {_tempUser.email = user.email} 

                if(user.photoURL !== null) {_tempUser.profileImgUrl = user.photoURL} 

                if(user.uid !== null) {_tempUser.uid = user.uid} 

                this.setState({
                    user: _tempUser
                })

                firebase.firestore().collection("Users")
                    .doc(_tempUser.uid)
                    .get()
                    .then((doc) => {
                        const data = doc.data()
                        if (data !== undefined) {
                            console.log("Document data:", );
                            this.setState({
                                savedRecipes: JSON.parse(data.savedRecipes)
                            })
                        } else {
                            console.log("No such document!");
                        }
    
                }).catch((e: any) => {
                    console.log("Error getting document:", e);
                });

            } else {
                // User is signed out.
                this.setState({
                    user: undefined
                });
            }
        }, function(error: any): void {
            console.log(error);
        });
    }

    /**
     * Once the component has fully loaded load the recipes from firestore
     *
     * @memberof WholeCup
     */
    componentDidMount(): void {
        
        var db = firebase.firestore();
        const allRecipesTemp: Map<string, recipe> = new Map<string, recipe>();

        db.collection("recipes").get().then((querySnapshot: any): any => {
            querySnapshot.forEach((doc: any): any => {
                allRecipesTemp.set(doc.id, doc.data());
            });

            this.setState({
                recipes: allRecipesTemp
            })
            // console.log("Recipes Loaded");
        });

        this.initApp();

        var uiConfig = {
            // signInSuccessUrl: '/',
            signInOptions: [
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
        };
        
        var ui: any;
        
        // Initialize the FirebaseUI Widget using Firebase.
        ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', uiConfig);

    }

    handleTagClick(tag: string): void {
        this.setState({
            SearchVal: tag
        })
    }

    onSearchClear(): void {
        this.setState({
            SearchVal: ""
        })
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
    }

    onLogout(): void {
        window.location.reload(false); 
        firebase.auth().signOut()
    }

    onToggleFavourite(key: string, val: boolean): void {
        console.log(`Toggling ${key} to ${val}`);
        let savedRecipes: string[] = [];
        if(val === true){
            savedRecipes = this.state.savedRecipes.concat([key]);
        } else {
            savedRecipes = this.state.savedRecipes;
            savedRecipes.splice(savedRecipes.indexOf(key), 1);
        }

        this.setState({
            savedRecipes: savedRecipes
        })

        if(this.state.user !== undefined){
             // save to firestore
            firebase.firestore().collection("Users").doc(this.state.user.uid).set({
                savedRecipes: JSON.stringify(savedRecipes),
            })
        } else{
            console.log("You need to be logged in to save recipes")
        }
    }

    render(): JSX.Element {

        let loginPanel: JSX.Element = 
            <Button onClick={() => this.toggleLoginModal(true)} style={{color: "#FFFFFF"}}>
                Login
            </Button>;

        if(this.state.user !== undefined){
            loginPanel = 
                <Button onClick={this.onLogout} style={{color: "#FFFFFF"}}>
                    Log out
                </Button>;
        }

        // the login window
        const loginModal: JSX.Element = (
            <Modal
                disablePortal   
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.loginOpen}
                onClose={() => this.toggleLoginModal(false)}
            >
                <Paper className="loginModal">
                    <Typography variant="title" id="modal-title">
                    Login
                    </Typography>
                </Paper>
            </Modal>
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
                            onClick={() => this.setState({drawerOpen: false})} 
                            className={this.props.classes.menuButton} 
                            color="inherit" aria-label="Menu"
                        >
                            <Close />
                        </IconButton> 
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <Link to="/recipes">
                        <ListItem>
                            <ListItemIcon className="whiteText">
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText 
                                disableTypography
                                primary={
                                    <Typography style={{ color: '#FFFFFF' }}>
                                        Browse all Recipes
                                    </Typography>
                                }/> 
                        </ListItem>
                    </Link>
                    <Link to="/saved">
                        <ListItem>
                            <ListItemIcon className="whiteText">
                                <Favorite />
                            </ListItemIcon>
                            <ListItemText 
                                disableTypography
                                primary={
                                    <Typography style={{ color: '#FFFFFF'}}>
                                        Saved Recipes
                                    </Typography>
                                }/> 
                        </ListItem>
                    </Link>
                </List>
                <Divider/>
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
                            color="inherit" aria-label="Menu"
                        >
                            <MenuIcon />
                        </IconButton> 
                        <Typography variant="title" color="inherit" className={this.props.classes.flex}>
                            <Link to="/">
                                Half a Cup
                            </Link>
                        </Typography>
                        <SearchBar value={this.state.SearchVal} onSearchClear={this.onSearchClear} recipes={this.state.recipes}/>
                    </Toolbar>
                </AppBar>
                {loginModal}

                {this.state.user === undefined ? <div id="firebaseui-auth-container"  ref="loginModalRef"></div> : <span></span>}

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
                        path='/recipes' 
                        render={()=><RecipeBrowser 
                            onToggleFavourite={this.onToggleFavourite} 
                            recipes={this.state.recipes}
                            favRecipes={this.state.savedRecipes}
                            />}
                    />
                    <Route 
                        exact
                        path='/saved' 
                        render={()=><SavedRecipes 
                            savedRecipeKeys={this.state.savedRecipes} 
                            allRecipes={this.state.recipes}
                            onToggleFavourite={this.onToggleFavourite} 
                        />}
                    />
                    <Route path='/recipes/:key' render={
                        ({match}) => {
                            const recipe: recipe | undefined = this.state.recipes.get(match.params.key)
                            if(recipe !== undefined){
                                return <OpenRecipe
                                        onToggleFavourite={this.onToggleFavourite}
                                        recipeKey={match.params.key}
                                        thisRecipe={recipe}
                                        favRecipes={this.state.savedRecipes}
                                        onTagClick={this.handleTagClick}
                                    />
                            } else{
                                return <span></span>
                            }
                        }
                    }/>
                </Switch>
            </div>
        );
    }
}





export default withStyles(style)<Props>(HalfACup);