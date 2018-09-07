import * as React from "react";
import Paper from "@material-ui/core/Paper"
import { Close, Search, ImportContacts, Favorite, Edit, Save, Delete, Add } from '@material-ui/icons/'
import "./OpenRecipe.css";
import { IconButton, Button, TextField, Input } from "@material-ui/core";
import RecipeReaderView from "./RecipeReaderView";
import { Switch, Route, Link } from "react-router-dom";
import StarRating from "../elements/StarRating"


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
    rating: number
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
    ogRecipe: recipe,
    editedRecipe: recipe,
    canEdit: boolean
}


export default class OpenRecipe extends React.Component<Props, State, object> {

    constructor(props: Props) {
        super(props);
        let canEdit: boolean = false;
        if(props.user !== undefined && props.user !== null){
            if(props.user.uid === "bWcWTtHgkJaw0RK2EPqIV9KKUfw2" ){
                canEdit = true
            }
        }
        // this.handleTagClick = this.handleTagClick.bind(this)
        this.state = {
            isFavourite: this.props.favRecipes.indexOf(this.props.recipeKey) > -1,
            editMode: false,
            ogRecipe: JSON.parse(JSON.stringify(props.thisRecipe)),
            canEdit: canEdit,
            editedRecipe: JSON.parse(JSON.stringify(props.thisRecipe))
        }
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onEditSave = this.onEditSave.bind(this)
        this.handleRatingChange = this.handleRatingChange.bind(this)
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
        if(this.props.user){
            this.setState({
                isFavourite: this.state.isFavourite === false
            })
        }

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
            editMode: this.state.editMode === false,
            editedRecipe: this.state.ogRecipe
        })
    }

    onEditSave(): void {
        const recipeChanges: recipe = this.state.editedRecipe;
        this.toggleEdit();
        this.setState({
            editedRecipe: recipeChanges
        })
        this.props.onRecipeSave(this.state.editedRecipe, this.props.recipeKey);
    }

    handleRecipeChange(value: string | undefined, section: string, key: number): void {
        console.log(`Change in ${section} line: ${key} to ${value}`)
        const newRecipe: recipe = JSON.parse(JSON.stringify(this.state.editedRecipe));

        if(section === 'ingredients') {
            if(value === undefined){
                newRecipe.ingredients.splice(key, 1);
            } else {
                newRecipe.ingredients.splice(key, 1, value);
            }
        } else if(section === 'steps') {
            if(value === undefined){
                newRecipe.steps.splice(key, 1);
            } else {
                newRecipe.steps.splice(key, 1, value);
            }
        } else if(section === 'tags') {
            if(value === undefined){
                newRecipe.tags.splice(key, 1);
            } else {
                newRecipe.tags.splice(key, 1, value);
            }
        } else if(section === 'title') {
            newRecipe.title = value === undefined ? "" : value;
        } else if(section === 'subtitle') {
            newRecipe.subtitle = value === undefined ? "" : value;
        }

        this.setState({
            editedRecipe: newRecipe
        })

        console.log(newRecipe);
        console.log(this.state.editedRecipe);
    }

    handleRatingChange(newVal: number): void {
        console.log(`Changing rating to: ${newVal}`)
        const newRecipe = this.state.editedRecipe;
        newRecipe.rating = newVal;
        this.setState({
            editedRecipe: newRecipe
        })
        this.props.onRecipeSave(newRecipe, this.props.recipeKey);

        console.log(this.state.editedRecipe)

    }

    addInput(section: string): void {
        const newRecipe: recipe = JSON.parse(JSON.stringify(this.state.editedRecipe));
        if(section === 'ingredients'){
            newRecipe.ingredients.push("")
        } else if(section === 'steps'){
            newRecipe.steps.push("")
        } else if(section === 'tags'){
            newRecipe.tags.push("")
        } 

        this.setState({
            editedRecipe: newRecipe
        })
    }

    render(): JSX.Element {
        // -------------  Ingredients  ------------- //
        let ingredients: JSX.Element[] = []
        let count: number = 0;
        for(const ingredient of this.state.editedRecipe.ingredients){
            if(this.state.editMode){
                const realNum: number = count;
                ingredients.push(
                    <li key={count}>
                        <TextField 
                            label="Ingredient"
                            value={ingredient} 
                            onChange={(e) => this.handleRecipeChange(e.target.value, 'ingredients', realNum)}
                            className="ingredientField"
                        />
                        <IconButton onClick={(e) => this.handleRecipeChange(undefined, 'ingredients', realNum)}>
                            <Delete></Delete>
                        </IconButton>
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
        if(this.state.editMode){
            ingredients.push(<IconButton key={count} onClick={() => this.addInput('ingredients')}><Add></Add></IconButton>);
        }

        // ----------------  Steps  ---------------- //
        count = 0;
        let steps: JSX.Element[] = []
        for(const step of this.state.editedRecipe.steps){
            if(this.state.editMode){
                const realNum: number = count;
                steps.push(
                    <li key={count}>
                        <TextField 
                            label="Step"
                            value={step} 
                            onChange={(e) => this.handleRecipeChange(e.target.value, 'steps', realNum)}
                            className="stepField"
                            multiline
                            rowsMax="7"
                        />
                        <IconButton onClick={(e) => this.handleRecipeChange(undefined, 'steps', realNum)}>
                            <Delete></Delete>
                        </IconButton>
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
        if(this.state.editMode){
            steps.push(<IconButton key={count} onClick={() => this.addInput('steps')}><Add></Add></IconButton>);
        }

        // -----------------  Tags  ---------------- //
        let tags: JSX.Element[] = []
        count = 0;
        for(const tag of this.state.editedRecipe.tags){
            if(this.state.editMode){
                const realNum: number = count;
                tags.push(
                    <li key={count}>
                        <TextField 
                            label="Tags"
                            onChange={(e) => this.handleRecipeChange(e.target.value, 'tags', realNum)}
                            value={tag} 
                        />
                        <IconButton onClick={(e) => this.handleRecipeChange(undefined, 'tags', realNum)}>
                            <Delete></Delete>
                        </IconButton>
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
        if(this.state.editMode){
            tags.push(<IconButton key={count} onClick={() => this.addInput('tags')}><Add></Add></IconButton>);
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
        let title: JSX.Element = (<h3 className="recipeTitle">{this.state.editedRecipe.title}</h3>);
        if(this.state.editMode){
            title = (
                <Input 
                    multiline
                    style={{fontSize: "26pt", color: "#f44336",fontWeight: "bold"}}
                    onChange={(e) => this.handleRecipeChange(e.target.value, 'title', 0)}
                    value={this.state.editedRecipe.title} 
                />
            )
        }

        // ---------------  SubTitle  -------------- //
        let subtitle: JSX.Element = <em>{this.state.editedRecipe.subtitle}</em>;
        if(this.state.editMode){
            subtitle = (
                <TextField 
                    multiline
                    label="Subtitle"
                    className="stepField"
                    onChange={(e) => this.handleRecipeChange(e.target.value, 'subtitle', 0)}
                    value={this.state.editedRecipe.subtitle} 
                />
            );
        }

        // ---------------  Rating  ---------------- //
        let rating: JSX.Element = <StarRating
                value={this.state.editedRecipe.rating}
                onChangeVal={this.handleRatingChange}
            />

        const recipeView: JSX.Element = 
            <Paper className="openRecipeTile">
                {topButtons}
                {title}
                {subtitle}
                {rating}
                
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
                    recipe={this.state.editedRecipe}
                    />
                }/>
            </Switch>
        );
    }
}
