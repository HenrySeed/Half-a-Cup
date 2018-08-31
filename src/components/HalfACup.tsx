import * as React from "react";
import "./HalfACup.css";
import OpenRecipe from "./OpenRecipe";
import SearchBar from "./SearchBar";
import RecipeBrowser from "./RecipeBrowser";

import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
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
        marginRight: 20,
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
    SearchVal: string
}


class HalfACup extends React.Component<Props & PropsWithStyles, State> {

    constructor(props: Props & PropsWithStyles) {
        super(props);
        this.state = {
            recipes: new Map<string, recipe>(),
            searchOpen: false,
            SearchVal: ""
        };

        const config = {
            apiKey: "AIzaSyAnlTaJufGESWh80ttA3C5s9ouyIw1J-1E",
            authDomain: "wholecup-72a6b.firebaseapp.com",
            databaseURL: "https://wholecup-72a6b.firebaseio.com",
            projectId: "wholecup-72a6b",
            storageBucket: "wholecup-72a6b.appspot.com",
            messagingSenderId: "51118699872"
        };

        firebase.initializeApp(config);
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
            console.log("Recipes Loaded");
            
        });

        // this.handleTagClick = this.handleTagClick.bind(this)

        
    }

    // handleTagClick(str: string): void {
    //     this.searchRecipes(str)
    //     this.setState({
    //         SearchVal: str
    //     })
    // }


    render(): JSX.Element {
        // should make nice status bar on safari ios
        const browser = detect();
        const statusBar: JSX.Element[] = [];
        if (browser) {
            if(browser.os === "iOS" && browser.name === "ios"){
                statusBar.push(<div id="statusbar"> </div>)
            } else{
                statusBar.push(<span></span>)
            }
        }

        return (
            <div>
                {statusBar}
                <AppBar position="sticky">
                    <Toolbar>
                        {/* <IconButton className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
                            {/* <MenuIcon />
                        </IconButton> */}
                        <Typography variant="title" color="inherit" className={this.props.classes.flex}>
                            <Link to="/">
                                Half a Cup
                            </Link>
                        </Typography>
                        <SearchBar value={this.state.SearchVal} recipes={this.state.recipes}/>
                    </Toolbar>
                </AppBar>

                <Switch>
                    <Route path='/' render={()=><RecipeBrowser recipes={this.state.recipes}/>}/>
                    <Route path='/recipes' render={()=><RecipeBrowser recipes={this.state.recipes}/>}/>
                </Switch>
            </div>
        );

        // // If there is no recipe open
        // if (this.state.recipeOpen === false){
        //     // Search open
        //     if(this.state.searchOpen){
        //         let recipeTable: JSX.Element[] = [];
        //         for (const recipeKey of this.state.searchResult) {
        //             recipeTable.push(
        //                 <Grid className="recipeGridTile">
        //                     <RecipeTile
        //                         recipeKey={recipeKey}
        //                         onOpen={this.handleOpenRecipe}
        //                         thisRecipe={this.state.recipes.get(recipeKey)}
        //                     />
        //                 </Grid>
        //             );
        //         }

        //         toRender.push(
        //             <div>
        //                 <Grid
        //                     className="recipeTable"
        //                     container
        //                     direction="column"
        //                     justify="flex-start"
        //                     alignItems="stretch"
        //                 >
        //                     {recipeTable}
        //                 </Grid>
        //             </div>
        //         );

        //     } 
              
        
    }
}





export default withStyles(style)<Props>(HalfACup);