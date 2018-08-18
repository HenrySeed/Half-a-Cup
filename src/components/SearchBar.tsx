import * as React from "react";
import Input from '@material-ui/core/Input';

import Search from '@material-ui/icons/Search';
import Cancel from '@material-ui/icons/Cancel';

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
    onSearch: Function;
    value: string;
}

 

export default class SearchBar extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props)
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            searchValue: ""
        };

        this.handleClearSearch = this.handleClearSearch.bind(this)
    }

    handleSearch(event: any): void {
        this.props.onSearch(event.target.value);
    }

    handleClearSearch(event: any): void {
        this.props.onSearch("");
    }


    render(): JSX.Element {
        return (
            <div className="searchBar">
                <Search className="searchicon"/>
                <Input 
                    className="searchField"
                    disableUnderline 
                    placeholder="Search" 
                    onChange={this.handleSearch} 
                    value={this.props.value}
                    endAdornment={
                        <InputAdornment position="end">
                        {this.props.value !== "" ?
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
            </div>
        );
    }
}




