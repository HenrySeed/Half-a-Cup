import * as React from "react";
import { Grid, Paper, Typography } from "@material-ui/core"
import { Switch, Route, Link } from "react-router-dom"
import OpenRecipe from "./OpenRecipe";
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

interface State {
    pages: JSX.Element[],
    currentPageNum: number,
    redirectRecipeKey: string
}

export interface Props {
    recipes: Map<string, recipe>,
    onToggleFavourite: Function,
    favRecipes: string[],
    saved: string[]
}

export default class RecipeBrowser extends React.Component<Props, State, object> {

    reactSwipe: any

    constructor(props: Props) {
        super(props)
        this.state = {
            pages: [],
            redirectRecipeKey: "",
            currentPageNum: 0,
        }

        this.handleTagClick = this.handleTagClick.bind(this)
        this.handleRecipeClick = this.handleRecipeClick.bind(this)

    }

    handleTagClick(): void {

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
        let count: number = 0;
        for (const [key, value] of Array.from(this.props.recipes)) {
            const isFav: boolean = this.props.favRecipes.indexOf(key) > -1;
            recipeTable.push(
                <Grid item xs={12} className="recipeGridTile" key={count}>
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
            count++;
        }

        return(
            <Switch>
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
 