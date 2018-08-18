import * as React from "react";
import "./WholeCup.css";
import RecipeTile from "./RecipeTile";
import OpenRecipe from "./OpenRecipe";

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
    recipes: recipe[]
    selectedRecipe: number
    recipeOpen: boolean
}




class WholeCup extends React.Component<Props & PropsWithStyles, State> {

    constructor(props: Props & PropsWithStyles) {
        super(props);
        this.state = {
            recipes: [],
            selectedRecipe: 0,
            recipeOpen: false,
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

        const allRecipesTemp: recipe[] = []

        db.collection("recipes").get().then((querySnapshot: any): any => {
            querySnapshot.forEach((doc: any): any => {
                allRecipesTemp.push(doc.data());
            });

            this.setState({
                recipes: allRecipesTemp
            })
            console.log("Recipes Loaded");
            
        });

        this.handleOpenRecipe = this.handleOpenRecipe.bind(this)
        this.handleCloseRecipe = this.handleCloseRecipe.bind(this)
        
    }

    handleOpenRecipe(index: number): void {
        this.setState({
            selectedRecipe: index,
            recipeOpen: true
        });
    };

    handleCloseRecipe(index: number): void {
        this.setState({
            recipeOpen: false
        });
    };



    render(): JSX.Element[] {

        let toRender: JSX.Element[] = [
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
                        {/* <MenuIcon /> */}
                    </IconButton>
                    <Typography variant="title" color="inherit" className={this.props.classes.flex}>
                        Whole Cup
                    </Typography>
                </Toolbar>
            </AppBar>
        ];

        if(this.state.recipeOpen === false){
            let recipeTable: JSX.Element[] = [];
            let index: number = 0
            for (const recipe of this.state.recipes) {
                recipeTable.push(
                    <Grid item xs={12} className="recipeTile">
                        <RecipeTile
                            index={index}
                            onOpen={this.handleOpenRecipe}
                            thisRecipe={recipe}
                        />
                    </Grid>
                );
                index++;
            }


            toRender.push(
                <div>
                    <Grid
                        className="recipeTable"
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        {recipeTable}
                    </Grid>
                </div>
            );
        } else{
            toRender.push(
                <OpenRecipe 
                    thisRecipe={this.state.recipes[this.state.selectedRecipe]}
                    onClose={this.handleCloseRecipe}
                />
            );
        }

        return toRender;

        
    }
}





export default withStyles(style)<Props>(WholeCup);