import * as React from "react";
import "./WholeCup.css";
import RecipeTile from "./RecipeTile";
import OpenRecipe from "./OpenRecipe";
import SearchBar from "./SearchBar";


import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import {Paper, Grid, IconButton} from "@material-ui/core"

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
    selectedRecipe: recipe | undefined
    recipeOpen: boolean
    searchResult: string[]
    searchOpen: boolean,
    SearchVal: string
}


class WholeCup extends React.Component<Props & PropsWithStyles, State> {

    constructor(props: Props & PropsWithStyles) {
        super(props);
        this.state = {
            recipes: new Map<string, recipe>(),
            selectedRecipe: undefined,
            recipeOpen: false,
            searchResult: [],
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

        this.handleOpenRecipe = this.handleOpenRecipe.bind(this)
        this.handleCloseRecipe = this.handleCloseRecipe.bind(this)
        this.searchRecipes = this.searchRecipes.bind(this)
        this.handleTagClick = this.handleTagClick.bind(this)
        
    }

    handleOpenRecipe(key: string): void {
        this.setState({
            selectedRecipe: this.state.recipes.get(key),
            recipeOpen: true
        });
    };


    handleCloseRecipe(index: number): void {
        this.setState({
            selectedRecipe: undefined,
            recipeOpen: false
        });
    };

    handleTagClick(str: string): void {
        this.searchRecipes(str)
        this.setState({
            SearchVal: str
        })
    }


    searchRecipes(str: string): void{
        console.log(str)

        this.setState({
            recipeOpen: false,
            SearchVal: str
        })

        if(str.trim() !== ""){
            this.setState({
                searchOpen: true
            })
        } else{
            this.setState({
                searchOpen: false
            })
        }

        
        const words: string[] = str.split(' ');
        const foundRecipes: string[] = []

        for(const recipeKey of Array.from(this.state.recipes.keys())){
            let allTagsFound: boolean = true;
            const recipe: recipe | undefined = this.state.recipes.get(recipeKey);
            if(recipe === undefined){continue}

            for(const word of words){
                if(!recipe.title.toLowerCase().includes(word.toLowerCase())){
                    let foundInTags: boolean = false;
                    for(const tag of recipe.tags){
                        if(tag.toLowerCase().includes(word.toLowerCase())){
                            foundInTags = true;
                            break;
                        }
                    }
                    if(!foundInTags){
                        allTagsFound = false
                    }
                }
            }
            if(allTagsFound){
                foundRecipes.push(recipeKey)
            }
        }

        this.setState({
            searchResult: foundRecipes
        })
    }


    render(): JSX.Element[] {

        let toRender: JSX.Element[] = [
            <AppBar position="sticky">
                <Toolbar>
                    {/* <IconButton className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
                        {/* <MenuIcon />
                    </IconButton> */}
                    <Typography variant="title" color="inherit" className={this.props.classes.flex}>
                        Whole Cup
                    </Typography>
                    <SearchBar onSearch={this.searchRecipes} value={this.state.SearchVal}/>
                </Toolbar>
            </AppBar>
        ];

        // If there is no recipe open
        if (this.state.recipeOpen === false){
            // Search open
            if(this.state.searchOpen){
                let recipeTable: JSX.Element[] = [];
                for (const recipeKey of this.state.searchResult) {
                    recipeTable.push(
                        <Grid className="recipeGridTile">
                            <RecipeTile
                                recipeKey={recipeKey}
                                onOpen={this.handleOpenRecipe}
                                thisRecipe={this.state.recipes.get(recipeKey)}
                            />
                        </Grid>
                    );
                }

                toRender.push(
                    <div>
                        <Grid
                            className="recipeTable"
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                        >
                            {recipeTable}
                        </Grid>
                    </div>
                );

            } 
            // No Search
            else{
                let recipeTable: JSX.Element[] = [];
                for (const recipeKey of Array.from(this.state.recipes.keys())) {
                    recipeTable.push(
                        <Grid item xs={12} className="recipeGridTile">
                            <RecipeTile
                                recipeKey={recipeKey}
                                onOpen={this.handleOpenRecipe}
                                thisRecipe={this.state.recipes.get(recipeKey)}
                            />
                        </Grid>
                    );
                }

                toRender.push(
                    <div>
                        <Grid
                            className="recipeTable"
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                        >
                            {recipeTable}
                        </Grid>
                    </div>
                );
            }
            
        } else if(this.state.selectedRecipe !== undefined) {
            toRender.push(
                <OpenRecipe 
                    thisRecipe={this.state.selectedRecipe}
                    onClose={this.handleCloseRecipe}
                    onTagClick={this.handleTagClick}
                />
            );
        }

        return toRender;

        
    }
}





export default withStyles(style)<Props>(WholeCup);