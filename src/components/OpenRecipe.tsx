import * as React from "react";
import Paper from "@material-ui/core/Paper"
import { Close, Search, ImportContacts, Favorite } from '@material-ui/icons/'
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
    // onTagClick: Function;
    recipeKey: string,
    thisRecipe: recipe,
    favRecipes: string[],
    onToggleFavourite: Function,
    match?: any
}


export interface State {
    isFavourite: boolean
}


export default class OpenRecipe extends React.Component<Props, State, object> {

    constructor(props: Props) {
        super(props)
        // this.handleTagClick = this.handleTagClick.bind(this)
        this.state = {
            isFavourite: this.props.favRecipes.indexOf(this.props.recipeKey) > -1
        }
        this.toggleFavourite = this.toggleFavourite.bind(this)
    }

    componentWillMount(): void {
        window.scrollTo(0, 0)
    }

    // handleTagClick(e: any, str: string): void {
    //     if(this.props.onTagClick){
    //         this.props.onTagClick(str.trim())
    //     }
    // }

    toggleFavourite(): void {
        this.setState({
            isFavourite: this.state.isFavourite === false
        })
        // if this recipe is currently favourited
        if(this.state.isFavourite){
            this.props.onToggleFavourite(this.props.recipeKey, false)
        } else{
            this.props.onToggleFavourite(this.props.recipeKey, true)
        }
    }

    render(): JSX.Element {
        let ingredients: JSX.Element[] = []
        let count: number = 0;
        for(const ingredient of this.props.thisRecipe.ingredients){
            ingredients.push(
                <li key={count}>
                    {ingredient}
                </li>
            )
            count++;
        }

        let steps: JSX.Element[] = []
        for(const step of this.props.thisRecipe.steps){
            steps.push(
                <li key={count}>
                    {step}
                </li>
            )
            count++;
        }

        // let tags: JSX.Element[] = []

        // for(const tag of this.props.thisRecipe.tags){
        //     tags.push(
        //         <Button 
        //             className="tagButton"
        //             onClick={(e) => {this.handleTagClick(e, tag)}} 
        //             color="primary" 
        //             variant="outlined"
        //         >
        //             <Search className="tagIcon"/>
        //             {tag}
        //         </Button>
        //     )
        // }

        const recipeView: JSX.Element = <Paper className="openRecipeTile">
            <Link to='/recipes'>
                <IconButton className="close">
                    <Close/>
                </IconButton>
            </Link>
            <Link to={`/recipes/${this.props.recipeKey}/readerView`}>
                <IconButton className="close">
                    <ImportContacts/>
                </IconButton>
            </Link>
            {
                this.state.isFavourite 
                ?
                    <IconButton 
                        className="close" 
                        onClick={() => this.toggleFavourite()} 
                        style={{color: (this.state.isFavourite ? "#f44336" : "unset")}}
                    >
                        <Favorite/>
                    </IconButton> 
                :
                    <IconButton 
                        className="close" 
                        onClick={() => this.toggleFavourite()} 
                    >
                        <Favorite/>
                    </IconButton>
            }
            
            <h3 className="recipeTitle">{this.props.thisRecipe.title}</h3>
            <em>{this.props.thisRecipe.subtitle}</em>

            <h4>Ingredients</h4>
            <ul>{ingredients}</ul>

            <h4>Steps</h4>
            <ul>{steps}</ul>
            <br/><br/><br/>
            {/* <hr/>
            <br/> */}
            {/* Tags for this Recipe 
            <br/>
            <br/>
            {tags}
            <br/><br/> */}

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
