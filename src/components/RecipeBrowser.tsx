import * as React from "react";
import { Grid, Paper, Typography } from "@material-ui/core"
import { Switch, Route, Link } from "react-router-dom"
import OpenRecipe from "./OpenRecipe";



interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}

interface State {
    pages: JSX.Element[],
    currentPageNum: number
}

export interface Props {
    recipes: Map<string, recipe>,
    onToggleFavourite: Function,
    saved: string[]
}

export default class RecipeBrowser extends React.Component<Props, State, object> {

    reactSwipe: any

    constructor(props: Props) {
        super(props)
        this.state = {
            pages: [],
            currentPageNum: 0,
        }

        this.handleTagClick = this.handleTagClick.bind(this)
    }

    handleTagClick(): void {

    }

    render(): JSX.Element {

        let recipeTable: JSX.Element[] = [];
        let count: number = 0;
        for (const [key, value] of Array.from(this.props.recipes)) {
            recipeTable.push(
                <Grid item xs={12} className="recipeGridTile" key={count}>
                    <Link to={'/recipes/' + key}>
                        <Paper className="recipeTile">
                            <p>{value.title}</p>
                        </Paper>
                    </Link>
                </Grid>
            );
            count++;
        }

        return(
            <Switch>
                <Route exact path='/' render={
                    () => 
                        <Grid
                            className="recipeTable"
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                        >
                            <Typography variant="title" color="inherit" style={{marginLeft: "10px", marginBottom: "10px"}}>
                                All Recipes
                            </Typography>
                            {recipeTable}
                        </Grid>
                }/>
                <Route exact path='/recipes' render={
                    () => 
                        <Grid
                            className="recipeTable"
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                        >
                            <Typography variant="title" color="inherit" style={{marginLeft: "10px", marginBottom: "10px"}}>
                                All Recipes
                            </Typography>
                            {recipeTable}
                        </Grid>
                }/>
                <Route path='/recipes/:key' render={
                    ({match}) => {
                        const recipe: recipe | undefined = this.props.recipes.get(match.params.key)
                        if(recipe !== undefined){
                            return <OpenRecipe
                                    onToggleFavourite={this.props.onToggleFavourite}
                                    recipeKey={match.params.key}
                                    thisRecipe={recipe}
                                    favRecipes={this.props.saved}
                                    // onTagClick={this.handleTagClick}
                                />
                        } else{
                            return <span></span>
                        }
                    }
                        
                }/>
            </Switch>
        );
    }
}
 