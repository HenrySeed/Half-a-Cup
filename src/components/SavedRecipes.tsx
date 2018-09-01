import * as React from "react";
import Paper from "@material-ui/core/Paper"
import "./OpenRecipe.css"
import { Grid, Typography } from "@material-ui/core";
import OpenRecipe from "./OpenRecipe"
import { Switch, Route, Link } from "react-router-dom"

interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}

export interface Props {
    savedRecipeKeys: string[],
    allRecipes: Map<string,recipe>
}

export default class SavedRecipes extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props)
    }

    render(): JSX.Element {

        let recipeTable: JSX.Element[] = [];
        for (const [key, value] of Array.from(this.props.allRecipes)) {
            if(this.props.savedRecipeKeys.indexOf(key) > -1){
                recipeTable.push(
                    <Grid item xs={12} className="recipeGridTile" key={key}>
                        <Link to={'/recipes/' + key}>
                            <Paper className="recipeTile">
                                <p>{value.title}</p>
                            </Paper>
                        </Link>
                    </Grid>
                );
            }
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

