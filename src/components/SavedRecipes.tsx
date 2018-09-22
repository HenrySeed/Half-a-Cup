import * as React from "react";
import Paper from "@material-ui/core/Paper"
import "./OpenRecipe.css"
import { Grid, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Favorite } from '@material-ui/icons/'
import { Redirect } from 'react-router';
import RecipeList from "../elements/RecipeList";


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
        console.log(Array.from(this.props.allRecipes.keys()))


        // if we should redirect to the selected recipe redirect
        if(this.state.redirectRecipeKey !== ""){
            const key: string = this.state.redirectRecipeKey;
            this.setState({
                redirectRecipeKey: ""
            })
            return <Redirect push to={"/recipes/" + key} />;
        }

        const savedRecipes: Map<string, recipe> = new Map<string, recipe>();
        for (const [key, recipe] of Array.from(this.props.allRecipes)) {
            if (this.props.savedRecipeKeys.indexOf(key) > -1) {
                savedRecipes.set(key, recipe);
            }
        }

        console.log(Array.from(this.props.allRecipes.keys()))

        let table: JSX.Element;
        if (Array.from(this.props.allRecipes.keys()).length === 0) {
            table = <p className="noneSavedMessage" key="no_results">You havent saved any recipes yet, Save some so you can remember the ones you love!</p>;
        } else {
            table = 
                <RecipeList
                    recipes={savedRecipes}
                    favRecipes={this.props.savedRecipeKeys}
                    onToggleFavourite={this.props.onToggleFavourite}
                    onOpenRecipe={this.handleRecipeClick}
                />
        }

        return (
            <div  style={{marginLeft: "auto", marginRight: "auto", marginTop: "25px", marginBottom: "30px", maxWidth: "900px", width: "90%"}}>
                <Typography variant="title" color="inherit" style={{marginBottom: "10px"}}>
                    Your Favourite Recipes
                </Typography>
                {table}
            </div>
        );
    }
}

