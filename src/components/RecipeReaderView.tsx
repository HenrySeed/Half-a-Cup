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
                <h3>Gather the Ingredients &nbsp;&nbsp; 🍰</h3>
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

        if (this.props.isLoading) {
            return (
                <div className="readerBackground">
                    <IconButton
                        style={{ color: "#FFFFFF", float: "right" }}
                        onClick={() => window.history.back()}
                    >
                        <Close />
                    </IconButton>
                    <CircularProgress
                        style={{
                            marginRight: "auto",
                            marginLeft: "auto",
                            display: "block",
                            marginTop: "10vh"
                        }}
                        color="secondary"
                    />
                </div>
            );
        }

        return (
            <div className="readerBackground">
                <IconButton
                    style={{ color: "#FFFFFF", float: "right" }}
                    onClick={() => window.history.back()}
                >
                    <Close />
                </IconButton>
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
            </div>
        );
    }
}
