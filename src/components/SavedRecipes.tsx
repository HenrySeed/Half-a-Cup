import * as React from "react";
import Paper from "@material-ui/core/Paper"
import "./OpenRecipe.css"
import { Grid, Typography } from "@material-ui/core";
import OpenRecipe from "./OpenRecipe"
import { Switch, Route, Link } from "react-router-dom"
import { IconButton } from "@material-ui/core";
import { Favorite } from '@material-ui/icons/'
import { Redirect } from 'react-router';


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}

export interface State {
    redirectRecipeKey: string
}

export interface Props {
    savedRecipeKeys: string[],
    allRecipes: Map<string,recipe>
    onToggleFavourite: Function
}

export default class SavedRecipes extends React.Component<Props, State, object> {

    constructor(props: Props) {
        super(props)
        this.state = {
            redirectRecipeKey: ""
        }
        this.handleRecipeClick = this.handleRecipeClick.bind(this)
    }

    handleRecipeClick(key: string): void {
        // location.href = '/recipes/' + key;
        this.setState({
            redirectRecipeKey: key
        })
    }

    render(): JSX.Element {

        // if we should redirect to the selected recipe redirect
        if(this.state.redirectRecipeKey !== ""){
            const key: string = this.state.redirectRecipeKey;
            this.setState({
                redirectRecipeKey: ""
            })
            return <Redirect push to={"/recipes/" + key} />;
        }

        let recipeTable: JSX.Element[] = [];
        for (const [key, value] of Array.from(this.props.allRecipes)) {

            const isFav: boolean = this.props.savedRecipeKeys.indexOf(key) > -1;

            if(this.props.savedRecipeKeys.indexOf(key) > -1){
                recipeTable.push(
                    <Grid item xs={12} className="recipeGridTile" key={key}>
                    {/* We cant use Link here because the onClick needs to be handled to avoid clicking the fav button opening the recipe */}
                        <Paper className="recipeTile" onClick={() => this.handleRecipeClick(key)}>
                            <p>{value.title}</p>
                                <IconButton 
                                    className="favButton" 
                                    onClick={(e) => {
                                        // This stops the fav button triggering the recipe onClick
                                        e.stopPropagation(); 
                                        this.props.onToggleFavourite(key, isFav === false)} 
                                    }
                                    style={{color: (isFav ? "#f44336" : "default")}}
                                >
                                    <Favorite/>
                                </IconButton> 
                        </Paper>
                    </Grid>
                );
            }
        }

        if(recipeTable.length === 0){
            recipeTable.push(<p className="noneSavedMessage" key="no_results">You havent saved any recipes yet, Save some so you can remember the ones you love!</p>)
        }

        return(
            <div>
                <Grid
                    className="recipeTable"
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                >
                    <Typography variant="title" color="inherit" style={{marginLeft: "10px", marginBottom: "10px"}}>
                        Saved Recipes
                    </Typography>
                    {recipeTable}
                </Grid>
            </div>
        );
    }
}

