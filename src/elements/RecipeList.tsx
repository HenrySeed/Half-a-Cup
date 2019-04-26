import * as React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Favorite } from "@material-ui/icons/";

interface recipe {
    title: string;
    subtitle: string;
    tags: string[];
    ingredients: string[];
    steps: string[];
}

export interface Props {
    recipeNames: Map<string, string>;
    favRecipes: string[];

    onToggleFavourite: Function;
    onOpenRecipe: Function;
}

export default class RecipeList extends React.Component<Props, object> {
    constructor(props: Props) {
        super(props);
    }

    render(): JSX.Element {
        let recipeTable: JSX.Element[] = [];
        let count: number = 0;
        for (const [key, value] of Array.from(this.props.recipeNames)) {
            const isFav: boolean = this.props.favRecipes.indexOf(key) > -1;
            recipeTable.push(
                <Grid item xs={12} className="recipeGridTile" key={count}>
                    {/* We cant use Link here because the onClick needs to be handled to avoid clicking the fav button opening the recipe */}
                    <Paper
                        className="recipeTile"
                        onClick={() => this.props.onOpenRecipe(key)}
                    >
                        <p>{value}</p>
                        <IconButton
                            className="favButton"
                            onClick={e => {
                                // This stops the fav button triggering the recipe onClick
                                e.stopPropagation();
                                this.props.onToggleFavourite(
                                    key,
                                    isFav === false
                                );
                            }}
                            style={{ color: isFav ? "#f44336" : "#777777" }}
                        >
                            <Favorite />
                        </IconButton>
                    </Paper>
                </Grid>
            );
            count++;
        }

        return (
            <Grid
                className="recipeTable"
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
            >
                {recipeTable}
            </Grid>
        );
    }
}
