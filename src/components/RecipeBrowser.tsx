import * as React from "react";
import { Grid, Paper, Typography } from "@material-ui/core"
import { IconButton } from "@material-ui/core";
import { Favorite } from '@material-ui/icons/'
import { Redirect } from 'react-router';
import RecipeList from '../elements/RecipeList';

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
    redirectRecipeKey: string,
    scrollPos: number
}

export interface Props {
    recipes: Map<string, recipe>,
    onToggleFavourite: Function,
    favRecipes: string[],
    title: string,
    emptyMessage?: string
}

export default class RecipeBrowser extends React.Component<Props, State, object> {

    reactSwipe: any

    constructor(props: Props) {
        super(props)
        this.state = {
            pages: [],
            redirectRecipeKey: "",
            currentPageNum: 0,
            scrollPos: 0
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

        let container = (
            <RecipeList
                recipes={this.props.recipes}
                favRecipes={this.props.favRecipes}
                onToggleFavourite={this.props.onToggleFavourite}
                onOpenRecipe={this.handleRecipeClick}
            />);
        if (Array.from(this.props.recipes.keys()).length === 0) {
            container = <p className="noneSavedMessage">{this.props.emptyMessage}</p>;
        }     
        

        return(<div  style={{marginLeft: "auto", marginRight: "auto", marginTop: "25px", marginBottom: "30px", maxWidth: "900px", width: "90%"}}>
                
                <Typography variant="title" color="inherit" style={{marginBottom: "10px"}}>
                    {this.props.title}
                </Typography>
                {container}
            </div>
        );
    }
}
 