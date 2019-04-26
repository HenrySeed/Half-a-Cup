import * as React from "react";
import { Typography } from "@material-ui/core";
import { Redirect } from "react-router";
import RecipeList from "../elements/RecipeList";

interface recipe {
    title: string;
    subtitle: string;
    tags: string[];
    ingredients: string[];
    steps: string[];
}

interface State {
    pages: JSX.Element[];
    currentPageNum: number;
    redirectRecipeKey: string;
    scrollPos: number;
}

export interface Props {
    recipeNames: Map<string, string>;
    onToggleFavourite: Function;
}

export default class SavedRecipes extends React.Component<
    Props,
    State,
    object
> {
    reactSwipe: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            pages: [],
            redirectRecipeKey: "",
            currentPageNum: 0,
            scrollPos: 0
        };

        this.handleTagClick = this.handleTagClick.bind(this);
        this.handleRecipeClick = this.handleRecipeClick.bind(this);
    }

    handleTagClick(): void {}

    handleRecipeClick(key: string): void {
        // location.href = '/recipes/' + key;
        this.setState({
            redirectRecipeKey: key
        });
    }

    render(): JSX.Element {
        // if we should redirect to the selected recipe redirect
        if (this.state.redirectRecipeKey !== "") {
            const key: string = this.state.redirectRecipeKey;
            return <Redirect push to={"/recipes/" + key} />;
        }

        let container = (
            <RecipeList
                recipeNames={this.props.recipeNames}
                favRecipes={Array.from(this.props.recipeNames.keys())}
                onToggleFavourite={this.props.onToggleFavourite}
                onOpenRecipe={this.handleRecipeClick}
            />
        );
        if (Array.from(this.props.recipeNames.keys()).length === 0) {
            container = (
                <p className="noneSavedMessage">
                    You don't have any favouite recipes yet, favourite some so
                    you can remember the ones you love!
                </p>
            );
        }

        return (
            <div
                style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "25px",
                    marginBottom: "30px",
                    maxWidth: "900px",
                    width: "90%"
                }}
            >
                <Typography
                    variant="title"
                    color="inherit"
                    style={{ marginBottom: "10px" }}
                >
                    Your favourite Recipes
                </Typography>
                {container}
            </div>
        );
    }
}
