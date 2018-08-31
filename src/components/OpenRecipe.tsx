import * as React from "react";
import Paper from "@material-ui/core/Paper"
import { Close, Search, ImportContacts } from '@material-ui/icons/'
import "./OpenRecipe.css"
import { IconButton, Button } from "@material-ui/core";
import RecipeReaderView from "./RecipeReaderView"
import { Switch, Route, Link } from "react-router-dom"



interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}


export interface Props {
    onTagClick: Function;
    recipeKey: string,
    thisRecipe: recipe,
    match?: any
}

export default class OpenRecipe extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props)
        this.handleTagClick = this.handleTagClick.bind(this)
        this.handleReaderViewClose = this.handleReaderViewClose.bind(this)
    }

    componentDidMount(): void {
        window.scrollTo(0, 0)
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

    render(): JSX.Element {

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

        const recipeView: JSX.Element = <Paper className="openRecipeTile">
            <IconButton className="close" onClick={() => window.history.back()}>
                <Close/>
            </IconButton>
            <Link to={`/recipes/${this.props.recipeKey}/readerView`}>
                <IconButton className="close">
                    <ImportContacts/>
                </IconButton>
            </Link>
            
            
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
    

        return (
            <Switch>
                <Route exact path='/recipes/:key' render={() => recipeView}/>
                <Route exact path='/recipes/:key/readerView' render={() => 
                    <RecipeReaderView 
                    recipe={this.props.thisRecipe}
                    />
                }/>
            </Switch>
        );
    }
}
