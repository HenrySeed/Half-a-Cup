import * as React from "react";
import Paper from "@material-ui/core/Paper"
import { Close, Search, ImportContacts } from '@material-ui/icons/'
import "./OpenRecipe.css"
import { IconButton, Button } from "@material-ui/core";
import RecipeReaderView from "./RecipeReaderView"


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}


export interface Props {
    thisRecipe: recipe;
    onClose: Function;
    onTagClick: Function;
}

export interface State {
    readerView: boolean
}

export default class OpenRecipe extends React.Component<Props, State, object> {

    constructor(props: Props) {
        super(props)
        this.state = {
            readerView: false
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleTagClick = this.handleTagClick.bind(this)
        this.handleReaderViewClose = this.handleReaderViewClose.bind(this)
        this.handleReaderViewOpen = this.handleReaderViewOpen.bind(this)
    }

    componentDidMount(): void {
        window.scrollTo(0, 0)
    }

    handleClose(e: any): void {
        if(this.props.onClose){
            this.props.onClose()
        }
    }

    handleTagClick(e: any, str: string): void {
        if(this.props.onTagClick){
            this.props.onTagClick(str.trim())
        }
    }

    handleReaderViewClose(): void {
        console.log("closing reader");
        this.setState({
            readerView: false
        })
    }

    handleReaderViewOpen(): void {
        
        this.setState({
            readerView: true
        })
    }

    render(): JSX.Element {

        if(this.state.readerView){
            return <RecipeReaderView 
                onClose={this.handleReaderViewClose}
                recipe={this.props.thisRecipe}
            />
        }

        let ingredients: JSX.Element[] = []

        for(const ingredient of this.props.thisRecipe.ingredients){
            ingredients.push(
                <li>
                    {ingredient}
                </li>
            )
        }

        let steps: JSX.Element[] = []

        for(const step of this.props.thisRecipe.steps){
            steps.push(
                <li>
                    {step}
                </li>
            )
        }

        let tags: JSX.Element[] = []

        for(const tag of this.props.thisRecipe.tags){
            tags.push(
                <Button 
                    className="tagButton"
                    onClick={(e) => {this.handleTagClick(e, tag)}} 
                    color="primary" 
                    variant="outlined"
                >
                    <Search className="tagIcon"/>
                    {tag}
                </Button>
            )
        }

        return (
            <Paper className="openRecipeTile">
                <IconButton className="close" onClick={this.handleClose}>
                    <Close/>
                </IconButton>
                <IconButton className="close" onClick={this.handleReaderViewOpen}>
                    <ImportContacts/>
                </IconButton>
                
                <h3 className="recipeTitle">{this.props.thisRecipe.title}</h3>
                <em>{this.props.thisRecipe.subtitle}</em>

                <h4>Ingredients</h4>
                <ul>{ingredients}</ul>

                <h4>Steps</h4>
                <ul>{steps}</ul>
                <br/><br/><br/>
                <hr/>
                <br/>
                Tags for this Recipe 
                <br/>
                <br/>
                {tags}
                <br/><br/>

            </Paper>
            
        );
    }
}
