import * as React from "react";
import "./HalfACup.css";
import SearchBar from "./SearchBar";
import RecipeBrowser from "./RecipeBrowser";
import SavedRecipes from "./SavedRecipes";

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
    ListItemText 
} from "@material-ui/core";
import Typography, { TypographyProps } from "@material-ui/core/Typography";

import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/List';
import { Favorite } from '@material-ui/icons/'
import { Switch, Route, Link } from "react-router-dom"
import { detect } from "detect-browser"

const firebase = require("firebase");
require("firebase/firestore");

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

export interface Props {
    color?: TypographyProps["color"];
}

export interface State {
    recipes: Map<string, recipe>
    searchOpen: boolean,
    drawerOpen: boolean,
    SearchVal: string,
    savedRecipes: string[]
}


class HalfACup extends React.Component<Props & PropsWithStyles, State> {

    constructor(props: Props & PropsWithStyles) {
        super(props);
        this.state = {
            recipes: new Map<string, recipe>(),
            searchOpen: false,
            drawerOpen: false,
            SearchVal: "",
            savedRecipes: []
        };

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

        this.onToggleFavourite = this.onToggleFavourite.bind(this)
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
    }

    toggleDrawer(status: boolean): void {
        this.setState({
          drawerOpen: status,
        });
    };

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

        console.log(`Fav Recipes: ${savedRecipes}`)
    }

    render(): JSX.Element {
        // should make nice status bar on safari ios
        const browser = detect();
        const statusBar: JSX.Element[] = [];
        let count: number = 0;
        if (browser) {
            if(browser.os === "iOS" && browser.name === "ios"){
                statusBar.push(<div id="statusbar" key={count}> </div>)
            } else{
                statusBar.push(<span key={count}></span>)
            }
            count++;
        }

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
            </div>
        );

        return (
            <div>
                {statusBar}
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
                        <SearchBar value={this.state.SearchVal} recipes={this.state.recipes}/>
                    </Toolbar>
                </AppBar>

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
                        path='/recipes' 
                        render={()=><RecipeBrowser 
                            onToggleFavourite={this.onToggleFavourite} 
                            saved={this.state.savedRecipes} 
                            recipes={this.state.recipes}
                            favRecipes={this.state.savedRecipes}
                            />}
                    />
                    <Route 
                        path='/saved' 
                        render={()=><SavedRecipes 
                            savedRecipeKeys={this.state.savedRecipes} 
                            allRecipes={this.state.recipes}
                            onToggleFavourite={this.onToggleFavourite} 
                        />}
                    />
                </Switch>
            </div>
        );
    }
}





export default withStyles(style)<Props>(HalfACup);