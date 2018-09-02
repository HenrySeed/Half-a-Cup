import * as React from "react";
import Input from '@material-ui/core/Input';

import Search from '@material-ui/icons/Search';
import Cancel from '@material-ui/icons/Cancel';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import {Link} from "react-router-dom"

import "./SearchBar.css"
import { InputAdornment, IconButton } from '@material-ui/core'


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}


export interface Props {
    value: string;
    recipes: Map<string, recipe>
}

export interface State {
    searchVal: string;
    searchResult: string[];
    searchOpen: boolean
}

 

export default class SearchBar extends React.Component<Props, State, object> {

    anchorEl: any;

    constructor(props: Props) {
        super(props)
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            searchVal: props.value,
            searchResult: [],
            searchOpen: false
        };

        this.handleClearSearch = this.handleClearSearch.bind(this)
        this.handleClose = this.handleClose.bind(this)

        
    }

    handleSearch(str: string): void {
        // console.log(`Searching for: ${str}`);

        this.setState({
            searchVal: str
        })

        if(str.trim() === ""){
            this.setState({
                searchResult: []
            })
            return;
        }

        
        const words: string[] = str.split(' ');
        const foundRecipes: string[] = []

        for(const recipeKey of Array.from(this.props.recipes.keys())){
            let allTagsFound: boolean = true;
            const recipe: recipe | undefined = this.props.recipes.get(recipeKey);
            if(recipe === undefined){continue}

            for(const word of words){
                if(!recipe.title.toLowerCase().includes(word.toLowerCase())){
                    let foundInTags: boolean = false;
                    for(const tag of recipe.tags){
                        if(tag.toLowerCase().includes(word.toLowerCase())){
                            foundInTags = true;
                            break;
                        }
                    }
                    if(!foundInTags){
                        allTagsFound = false
                    }
                }
            }
            if(allTagsFound){
                foundRecipes.push(recipeKey)
            }
        }

        this.setState({
            searchResult: foundRecipes
        })
    }

    handleClearSearch(event: any): void {
        this.handleSearch("");
        this.setState({
            searchOpen: false
        })
    }

    handleClose(): void {
        this.setState({
            searchOpen: false
        })
    }

    render(): JSX.Element {

        const searchResults: JSX.Element[] = [];
        let count: number = 0;
        for(const key of this.state.searchResult){
            const recipe: recipe | undefined = this.props.recipes.get(key);
            if(recipe === undefined){continue}

            searchResults.push(
                <Link to={`/recipes/${key}`} onClick={this.handleClearSearch} key={count}>
                    <MenuItem onClick={this.handleClose}>
                        {recipe.title}
                    </MenuItem>
                </Link>
            )
            count++;
        }

        if(searchResults.length === 0){
            searchResults.push(
                <p className="subText">No Results</p>
            )
        }

        const dropdown: JSX.Element = <Popper open={this.state.searchOpen} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => {
                return (
                    <Grow
                    {...TransitionProps}
                >
                    <Paper  className="searchResultsMenu">
                        <MenuList>
                        {searchResults}
                        </MenuList>
                    </Paper>
                </Grow>
                )
            }}
        </Popper>;

        let searchBar: JSX.Element = (
            <IconButton onClick={() => {this.setState({searchOpen: true})}} className="searchicon">
                <Search/>
            </IconButton>
        )

        if(this.state.searchOpen){
            searchBar = (
                <Input 
                    className="searchField"
                    disableUnderline 
                    placeholder="Search" 
                    onChange={(event) => this.handleSearch(event.target.value)} 
                    value={this.state.searchVal}
                    autoFocus
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="Clear Search"
                                onClick={this.handleClearSearch}
                            >
                                <Cancel />
                            </IconButton> 
                        </InputAdornment>
                    }
                />
            )

        }

        return (
            <ClickAwayListener onClickAway={this.handleClose}>
                <div 
                    ref={(node: any) => {
                        this.anchorEl = node;
                    }}
                    
                    aria-owns={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                >
                    {searchBar}
                </div>
                {dropdown}

            
            </ClickAwayListener>
        );

    }
}




