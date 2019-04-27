import * as React from "react";
import { Close, NavigateNext, NavigateBefore } from "@material-ui/icons/";
import { IconButton, Button, CircularProgress } from "@material-ui/core";
import "./RecipeReaderView.css";
import * as ReactSwipe from "react-swipe";
import Paper from "@material-ui/core/Paper";

interface recipe {
    title: string;
    subtitle: string;
    tags: string[];
    ingredients: string[];
    steps: string[];
}

interface State {
    currentPageNum: number;
}

export interface Props {
    recipe: recipe;
    isLoading: boolean;
}

export default class RecipeReaderView extends React.Component<
    Props,
    State,
    object
> {
    reactSwipe: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            currentPageNum: 0
        };
        this.handleNextButton = this.handleNextButton.bind(this);
        this.handlePrevButton = this.handlePrevButton.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    // handles the press of the next button
    handleNextButton(): void {
        this.setState({
            currentPageNum: this.reactSwipe.getPos() + 1
        });
        this.reactSwipe.next();
    }
    // handles the press of the previous button
    handlePrevButton(): void {
        this.setState({
            currentPageNum: this.reactSwipe.getPos() - 1
        });
        this.reactSwipe.prev();
    }

    // handles the counter updater when the pages are changed by swipe
    handlePageChange(): void {
        this.setState({
            currentPageNum: this.reactSwipe.getPos()
        });
        // reset the vertical scroll position on page change
        const myDiv = document.getElementById("swipeCarousel");
        if (myDiv !== null) {
            myDiv.scrollTop = 0;
        }
    }

    render(): JSX.Element {
        const tempPages: JSX.Element[] = [];
        let count: number = 0;
        const ingredients: JSX.Element[] = this.props.recipe.ingredients.map(
            function(ingredient: any, i: any): any {
                count++;
                return <ul key={count}>{ingredient}</ul>;
            }
        );

        tempPages.push(
            <span>
                <h3
                    style={{
                        fontSize: "34pt",
                        margin: "20px 0px",
                        color: "#f44336"
                    }}
                >
                    Gather the Ingredients
                </h3>
                <ul>{ingredients}</ul>
            </span>
        );

        for (const step of this.props.recipe.steps) {
            tempPages.push(<span>{step}</span>);
        }

        const hasNextPage: boolean =
            tempPages[this.state.currentPageNum + 1] !== undefined;
        const hasPrevPage: boolean =
            tempPages[this.state.currentPageNum - 1] !== undefined;

        const swipeOptions = {
            continuous: false,
            callback: () => {
                this.handlePageChange();
            }
        };

        const swiper = (
            <span>
                <ReactSwipe
                    ref={reactSwipe => (this.reactSwipe = reactSwipe)}
                    className="carousel"
                    id="swipeCarousel"
                    key={tempPages.length}
                    swipeOptions={swipeOptions}
                >
                    {tempPages.map(function(page: any, i: any): any {
                        return (
                            <span key={i} className="stepContainer">
                                <Paper className="stepText">{page}</Paper>
                            </span>
                        );
                    })}
                </ReactSwipe>
                <div className="controlPanel">
                    {hasPrevPage ? (
                        <Button
                            variant="fab"
                            color="default"
                            aria-label="Next"
                            className="prevButton"
                            onClick={this.handlePrevButton}
                        >
                            <NavigateBefore />
                        </Button>
                    ) : (
                        <span />
                    )}
                    {hasNextPage ? (
                        <Button
                            variant="fab"
                            aria-label="Next"
                            className="nextButton"
                            onClick={this.handleNextButton}
                        >
                            <NavigateNext />
                        </Button>
                    ) : (
                        <span />
                    )}
                </div>
            </span>
        );

        return (
            <div
                style={{
                    zIndex: 10000,
                    width: "100%",
                    height: "auto",
                    minHeight: "calc(100% - 50px)",
                    top: "50px",
                    paddingTop: "20px",
                    margin: "0",
                    backgroundColor: "#f44336",
                    position: "absolute",
                    color: "#333"
                }}
            >
                <IconButton
                    style={{
                        color: "#FFFFFF",
                        position: "fixed",
                        top: "0",
                        right: "0",
                        margin: "10px"
                    }}
                    onClick={() => window.history.back()}
                >
                    <Close />
                </IconButton>
                {this.props.isLoading ? (
                    <CircularProgress
                        style={{
                            marginRight: "auto",
                            marginLeft: "auto",
                            display: "block",
                            marginTop: "10vh"
                        }}
                        color="secondary"
                    />
                ) : (
                    swiper
                )}
            </div>
        );
    }
}
