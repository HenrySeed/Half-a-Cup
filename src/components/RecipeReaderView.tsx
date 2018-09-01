import * as React from "react";
import { Close, NavigateNext, NavigateBefore } from '@material-ui/icons/'
import { IconButton, Button } from "@material-ui/core";
import "./RecipeReaderView.css"
import * as ReactSwipe from 'react-swipe'
import Paper from '@material-ui/core/Paper'

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
    recipe: recipe,
}

export default class RecipeReaderView extends React.Component<Props, State, object> {

    reactSwipe: any

    constructor(props: Props) {
        super(props)
        this.state = {
            pages: [],
            currentPageNum: 0,
        }
        this.handleNextButton = this.handleNextButton.bind(this)
        this.handlePrevButton = this.handlePrevButton.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentDidMount(): void {
        this.genPages();
        console.log("reader view mounted")
    }

    genPages(): void {
        const tempPages: JSX.Element[] = [];
        const ingredients: JSX.Element[] = this.props.recipe.ingredients.map(
            function(ingredient: any, i: any): any{
                return <ul>{ingredient}</ul>
            }
        )

        tempPages.push(<span><h3>Gather the Ingredients &nbsp;&nbsp; 🍰</h3><ul>{ingredients}</ul></span>)

        for(const step of this.props.recipe.steps){
            tempPages.push(<span>{step}</span>);
        }

        this.setState({
            pages: tempPages
        })
    }

    // handles the press of the next button
    handleNextButton(): void {
        this.setState({
            currentPageNum: this.reactSwipe.getPos() + 1
        })
        this.reactSwipe.next();
    }
    // handles the press of the previous button    
    handlePrevButton(): void {
        this.setState({
            currentPageNum: this.reactSwipe.getPos() - 1
        })
        this.reactSwipe.prev();
    }

    // handles the counter updater when the pages are changed by swipe
    handlePageChange(): void {
        this.setState({
            currentPageNum: this.reactSwipe.getPos()
        })
        // reset the vertical scroll position on page change
        const myDiv = document.getElementById('swipeCarousel');
        if(myDiv !== null){
            myDiv.scrollTop = 0;
        }
    }

    render(): JSX.Element {
        const hasNextPage: boolean = this.state.pages[this.state.currentPageNum + 1] !== undefined;
        const hasPrevPage: boolean = this.state.pages[this.state.currentPageNum - 1] !== undefined;

        const swipeOptions = {
            continuous: false,
            callback: () => {
                this.handlePageChange();
            },
        }

        return (
            <div className="readerBackground">
                <IconButton className="close" onClick={() => window.history.back()}>
                    <Close/>
                </IconButton>
                <ReactSwipe 
                    ref={reactSwipe => this.reactSwipe = reactSwipe} 
                    className="carousel" 
                    id="swipeCarousel"
                    key={this.state.pages.length}
                    swipeOptions={swipeOptions}>
                    {this.state.pages.map(function(page: any, i: any): any{
                        return (
                            <span key={i} className="stepContainer">
                                <Paper className="stepText">
                                    {page}
                                </Paper>
                            </span>
                        );
                    })}
                </ReactSwipe>
                <div className="controlPanel">
                    {hasPrevPage
                        ? 
                        <Button 
                            variant="fab" 
                            color="default" 
                            aria-label="Next" 
                            className="prevButton" 
                            onClick={this.handlePrevButton}>
                            <NavigateBefore/>
                        </Button>
                        : 
                        <span/>
                    }
                    {hasNextPage
                        ? 
                        <Button 
                            variant="fab" 
                            aria-label="Next" 
                            className="nextButton" 
                            onClick={this.handleNextButton}>
                            <NavigateNext/>
                        </Button>
                        : 
                        <span/>
                    }
                </div>
            </div>
        );
    }
}
 