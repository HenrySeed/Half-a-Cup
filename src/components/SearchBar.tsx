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
        console.log(`Searching for: ${str}`);

        this.setState({
            searchVal: str
        })

        if(str.trim() !== ""){
            this.setState({
                searchOpen: true
            })
        } else{
            this.setState({
                searchOpen: false
            })
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

    render(): JSX.Element[] {

        const searchDropdown: JSX.Element[] = [];

        for(const key of this.state.searchResult){
            const recipe: recipe | undefined = this.props.recipes.get(key);
            if(recipe === undefined){continue}

            searchDropdown.push(
                <MenuItem onClick={this.handleClose}>{recipe.title}</MenuItem>
            )
        }

        return [
            <div 
                className="searchBar"
                ref={(node: any) => {
                    this.anchorEl = node;
                }}
                aria-owns={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
            >
                <Search className="searchicon"/>
                <Input 
                    className="searchField"
                    disableUnderline 
                    placeholder="Search" 
                    onChange={(event) => this.handleSearch(event.target.value)} 
                    value={this.state.searchVal}
                    endAdornment={
                        <InputAdornment position="end">
                        {this.state.searchVal !== "" ?
                            <IconButton
                                aria-label="Clear Search"
                                onClick={this.handleClearSearch}
                            >
                                <Cancel />
                            </IconButton> 
                            : <span/>}
                          
                        </InputAdornment>
                      }
                />
            </div>,

            <Popper open={this.state.searchOpen} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                // id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {searchDropdown}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>]
    }
}




