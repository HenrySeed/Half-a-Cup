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
}

export interface State {
    searchValue: string
}

export default class SearchBar extends React.Component<Props, State, object> {

    constructor(props: Props) {
        super(props)
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            searchValue: ""
        };

        this.handleClearSearch = this.handleClearSearch.bind(this)
    }

    handleSearch(event: any): void {
        this.setState({
            searchValue: event.target.value
        })

        this.props.onSearch(event.target.value);
    }

    handleClearSearch(event: any): void {
        this.setState({
            searchValue: ""
        })

        this.props.onSearch("");
    }


    render(): JSX.Element {
        return (
            <div>
                <Search className="searchicon"/>
                <Input 
                    disableUnderline 
                    placeholder="Search" 
                    onChange={this.handleSearch} 
                    value={this.state.searchValue}
                    endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear Search"
                            onClick={this.handleClearSearch}
                          >
                          {this.state.searchValue !== "" ? <Cancel /> : <span/>}
                          </IconButton>
                        </InputAdornment>
                      }
                />
            </div>
        );
    }
}




