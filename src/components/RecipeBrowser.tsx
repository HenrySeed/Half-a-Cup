import * as React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Favorite } from "@material-ui/icons/";
import { Redirect } from "react-router";
import RecipeList from "../elements/RecipeList";
import * as firebase from "firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    loadingRecipes: boolean;
    allRecipes: Map<string, recipe>;
}

export interface Props {
    recipes?: Map<string, recipe>;
    onToggleFavourite: Function;
    favRecipes: string[];
    title: string;
    emptyMessage?: string;
}

export default class RecipeBrowser extends React.Component<
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
            scrollPos: 0,
            loadingRecipes: true,
            allRecipes: new Map()
        };

        this.handleTagClick = this.handleTagClick.bind(this);
        this.handleRecipeClick = this.handleRecipeClick.bind(this);
    }

    componentDidMount(): void {
        const thisClass = this;
        firebase
            .firestore()
            .collection("recipes")
            .get()
            .then(function(querySnapshot: any): void {
                querySnapshot.forEach(function(doc: any): void {
                    thisClass.state.allRecipes.set(doc.id, doc.data());
                    thisClass.setState({
                        loadingRecipes: false
                    });
                });
            });
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
                recipes={this.state.allRecipes}
                favRecipes={this.props.favRecipes}
                onToggleFavourite={this.props.onToggleFavourite}
                onOpenRecipe={this.handleRecipeClick}
            />
        );
        if (Array.from(this.state.allRecipes.keys()).length === 0) {
            container = (
                <p className="noneSavedMessage">{this.props.emptyMessage}</p>
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
                    {this.props.title}
                </Typography>
                {this.state.loadingRecipes ? (
                    <CircularProgress
                        style={{
                            marginRight: "auto",
                            marginLeft: "auto",
                            display: "block",
                            marginTop: "10vh"
                        }}
                    />
                ) : (
                    <span />
                )}
                {container}
            </div>
        );
    }
}
