import * as React from "react";
import {
    Paper,
    Typography,
    GridList,
    GridListTile,
    CircularProgress
} from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

interface State {
    redirectRecipeKey: string;
}

export interface Props {
    title: string;
    recipeNames: Map<string, string>;
    favRecipes: string[];
    onToggleFavourite: Function;
    maximum: number;
    seeMoreLink: string;
    isLoading: boolean;
}

export default class RecipeScroller extends React.Component<
    Props,
    State,
    object
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            redirectRecipeKey: ""
        };
    }

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

        const recipes: JSX.Element[] = [];
        let count: number = 0;
        for (const [key, value] of Array.from(this.props.recipeNames)) {
            if (count === this.props.maximum) {
                recipes.push(
                    <Link to={this.props.seeMoreLink} key={key}>
                        <GridListTile
                            key={key}
                            style={{
                                cursor: "pointer",
                                minWidth: "180px",
                                maxWidth: "240px",
                                marginRight: "10px"
                            }}
                        >
                            <Button style={{ marginTop: "33px" }}>
                                See More...
                            </Button>
                        </GridListTile>
                    </Link>
                );
                break;
            }
            recipes.push(
                <GridListTile
                    key={key}
                    onClick={() => this.handleRecipeClick(key)}
                    style={{
                        cursor: "pointer",
                        minWidth: "240px",
                        maxWidth: "30%",
                        height: "auto !important"
                    }}
                >
                    <Paper
                        style={{
                            padding: "20px",
                            margin: "5px",
                            minHeight: "100px"
                        }}
                    >
                        {value}
                    </Paper>
                </GridListTile>
            );
            count++;
        }

        let container = (
            <div>
                <GridList
                    cols={2.5}
                    style={
                        {
                            // flexWrap: "nowrap",
                            // transform: "translateZ(0)",
                            // height: "120px"
                        }
                    }
                >
                    {recipes}
                </GridList>
                <div
                    style={{
                        width: "20px",
                        height: "100%",
                        backgroundColor: "#333"
                    }}
                />
            </div>
        );

        // if(this.props.isLoading){
        //     container =
        // }

        return (
            <div
                style={{
                    marginLeft: "5%",
                    // flexWrap: "wrap",
                    // justifyContent: "space-around",
                    // overflow: "hidden",
                    marginTop: "30px"
                }}
            >
                <Link to={this.props.seeMoreLink}>
                    <Typography
                        variant="title"
                        color="inherit"
                        style={{ marginBottom: "10px" }}
                    >
                        {this.props.title}
                    </Typography>
                </Link>

                {this.props.isLoading ? (
                    <CircularProgress
                        style={{
                            marginRight: "auto",
                            marginLeft: "auto",
                            display: "block",
                            marginTop: "20px"
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
