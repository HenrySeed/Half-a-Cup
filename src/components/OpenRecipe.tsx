import * as React from "react";
import Paper from "@material-ui/core/Paper"
import { Close, Search, ImportContacts, Favorite, Edit, Save } from '@material-ui/icons/'
import "./OpenRecipe.css"
import { IconButton, Button, TextField, Input } from "@material-ui/core";
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
    favRecipes: string[],
    onToggleFavourite: Function,
    onRecipeSave: Function,
    user: any
    match?: any
}


export interface State {
    isFavourite: boolean,
    editMode: boolean,
    thisRecipe: recipe,
    canEdit: boolean
}


export default class OpenRecipe extends React.Component<Props, State, object> {

    constructor(props: Props) {
        super(props);
        let canEdit: boolean = false;
        if(props.user !== undefined){
            if(props.user.uid === "bWcWTtHgkJaw0RK2EPqIV9KKUfw2" ){
                canEdit = true
            }
        }
        // this.handleTagClick = this.handleTagClick.bind(this)
        this.state = {
            isFavourite: this.props.favRecipes.indexOf(this.props.recipeKey) > -1,
            editMode: false,
            thisRecipe: this.props.thisRecipe,
            canEdit: canEdit
        }
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onEditSave = this.onEditSave.bind(this)
    }

    componentWillMount(): void {
        window.scrollTo(0, 0)
    }

    handleTagClick(e: any, str: string): void {
        if(this.props.onTagClick){
            this.props.onTagClick(str.trim())
        }
    }

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

    toggleEdit(): void {
        console.log(`Toggle edit to ${this.state.editMode === false}`)
        this.setState({
            editMode: this.state.editMode === false
        })
    }

    onEditSave(): void {
        this.toggleEdit();
        this.props.onRecipeSave(this.state.thisRecipe, this.props.recipeKey);
    }

    handleRecipeChange(e: any, section: string, key: number): void {
        console.log(`Change in ${section} line: ${key} to ${e.target.value}`)
        const newRecipe: recipe = this.state.thisRecipe;

        if(section === 'ingredients'){
            newRecipe.ingredients.splice(key, 1, e.target.value);
        } else if(section === 'steps'){
            newRecipe.steps.splice(key, 1, e.target.value);
        } else if(section === 'tags'){
            newRecipe.tags.splice(key, 1, e.target.value);
        } else if(section === 'title'){
            newRecipe.title = e.target.value;
        }

        this.setState({
            thisRecipe: newRecipe
        })

        console.log(newRecipe)
    }

    render(): JSX.Element {
        // -------------  Ingredients  ------------- //
        let ingredients: JSX.Element[] = []
        let count: number = 0;
        for(const ingredient of this.state.thisRecipe.ingredients){
            if(this.state.editMode){
                const realNum: number = count;
                ingredients.push(
                    <li key={count}>
                        <TextField 
                            value={ingredient} 
                            onChange={(e) => this.handleRecipeChange(e, 'ingredients', realNum)}
                            className="ingredientField"
                        />
                    </li>
                )
            } else {
                ingredients.push(
                    <li key={count}>
                        {ingredient}
                    </li>
                )
            }
            
            count++;
        }

        // ----------------  Steps  ---------------- //
        count = 0;
        let steps: JSX.Element[] = []
        for(const step of this.state.thisRecipe.steps){
            if(this.state.editMode){
                const realNum: number = count;
                steps.push(
                    <li key={count}>
                        <TextField 
                            value={step} 
                            onChange={(e) => this.handleRecipeChange(e, 'steps', realNum)}
                            className="stepField"
                            multiline
                            rowsMax="7"
                        />
                    </li>
                )
            } else {
                steps.push(
                    <li key={count}>
                        {step}
                    </li>
                )
            }
            
            count++;
        }

        // -----------------  Tags  ---------------- //
        let tags: JSX.Element[] = []
        count = 0;
        for(const tag of this.state.thisRecipe.tags){
            if(this.state.editMode){
                const realNum: number = count;
                tags.push(
                    <li key={count}>
                        <TextField 
                            onChange={(e) => this.handleRecipeChange(e, 'tags', realNum)}
                            value={tag} 
                        />
                    </li>
                )
            } else {
                tags.push(
                    <Button 
                        className="tagButton"
                        onClick={(e) => {this.handleTagClick(e, tag)}} 
                        color="primary" 
                        variant="outlined"
                        key={count}
                    >
                        <Search className="tagIcon"/>
                        {tag}
                    </Button>
                )
            }
            count++;
        }

        // --------------  Top Buttons  ------------ //
        let topButtons: JSX.Element = 
            <div>
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
                {this.state.canEdit
                ?
                    <IconButton 
                        className="close" 
                        onClick={() => this.toggleEdit()} 
                    >
                        <Edit/>
                    </IconButton>
                :
                    <span></span>
                }
            </div>
        if(this.state.editMode){
            topButtons = (
                <div>
                    <Button 
                        onClick={this.onEditSave} 
                        color="primary" 
                        variant="contained"
                        className="saveButton" 
                    >
                        <Save className="tagIcon"/>
                        Save
                    </Button>
                    <Button 
                        onClick={this.toggleEdit} 
                        color="default" 
                        variant="contained"
                        className="saveButton" 
                    >
                        <Save className="tagIcon"/>
                        Close
                    </Button>
                </div>
            )
        }

        // -----------------  Title  --------------- //
        let title: JSX.Element = (<h3 className="recipeTitle">{this.state.thisRecipe.title}</h3>);
        if(this.state.editMode){
            title = (
                <Input 
                    multiline
                    style={{fontSize: "26pt", color: "#f44336",fontWeight: "bold"}}
                    onChange={(e) => this.handleRecipeChange(e, 'title', 0)}
                    value={this.state.thisRecipe.title} 
                />
            )
        }

        const recipeView: JSX.Element = 
            <Paper className="openRecipeTile">
                {topButtons}
                 
                {title}
                <em>{this.state.thisRecipe.subtitle}</em>

                <h4>Ingredients</h4>
                <ul>{ingredients}</ul>

                <h4>Steps</h4>
                <ul>{steps}</ul>
                
                {this.state.editMode 
                    ? 
                    <h4>Tags for this Recipe</h4> 
                    : 
                    <span><br/><br/><br/><br/> <span>Tags for this Recipe</span><br/><br/></span>
                }
                {this.state.editMode ? <ul>{tags}</ul> :  <span>{tags}</span>}
                <br/><br/>
            </Paper>
    
        return (
            <Switch>
                <Route exact path='/recipes/:key' render={() => recipeView}/>
                <Route exact path='/recipes/:key/readerView' render={() => 
                    <RecipeReaderView 
                    recipe={this.state.thisRecipe}
                    />
                }/>
            </Switch>
        );
    }
}
