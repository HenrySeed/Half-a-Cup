import * as React from "react";
import Input from "@material-ui/core/Input";
import Search from "@material-ui/icons/Search";
import Cancel from "@material-ui/icons/Cancel";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { Link } from "react-router-dom";

import "./SearchBar.css";
import { InputAdornment, IconButton } from "@material-ui/core";

export interface Props {
    value: string;
    allRecipeTags: Map<string, string[]>;
    recipeNames: Map<string, string>;
    onSearchClear: Function;
}

export interface State {
    searchVal: string;
    searchResult: string[];
    searchOpen: boolean;
}

export default class SearchBar extends React.Component<Props, State, object> {
    anchorEl: any;

    constructor(props: Props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            searchVal: props.value,
            searchResult: [],
            searchOpen: false
        };

        this.handleClearSearch = this.handleClearSearch.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    }

    componentDidMount(): void {
        document.addEventListener("keydown", this.handleKeypress, false);
    }
    componentWillUnmount(): void {
        document.removeEventListener("keydown", this.handleKeypress, false);
    }

    handleKeypress(event: any): void {
        if (event.keyCode === 27) {
            this.handleClose();
        }
    }

    handleSearch(str: string): void {
        this.setState({
            searchVal: str
        });

        if (str.trim() === "") {
            this.setState({
                searchResult: []
            });
            return;
        }

        const words: string[] = str.split(" ");
        const foundRecipes: string[] = [];

        for (const recipeKey of Array.from(this.props.allRecipeTags.keys())) {
            let allTagsFound: boolean = true;
            const recipeTags:
                | string[]
                | undefined = this.props.allRecipeTags.get(recipeKey);
            if (recipeTags === undefined) {
                continue;
            }

            for (const word of words) {
                if (!(recipeTags.indexOf(word.toLowerCase()) > -1)) {
                    let foundInTags: boolean = false;
                    for (const tag of recipeTags) {
                        if (tag.toLowerCase().includes(word.toLowerCase())) {
                            foundInTags = true;
                            break;
                        }
                    }
                    if (!foundInTags) {
                        allTagsFound = false;
                    }
                }
            }
            if (allTagsFound) {
                foundRecipes.push(recipeKey);
            }
        }

        this.setState({
            searchResult: foundRecipes
        });
    }

    componentDidUpdate(): void {
        if (
            this.props.value !== "" &&
            this.props.value !== this.state.searchVal
        ) {
            this.setState({
                searchVal: this.props.value,
                searchOpen: true
            });

            this.handleSearch(this.props.value);
        }
    }

    handleClearSearch(event: any): void {
        this.handleSearch("");
        this.setState({
            searchVal: ""
        });
        this.props.onSearchClear();

        this.handleClose();
    }

    handleClose(): void {
        this.setState({
            searchOpen: false
        });
    }

    render(): JSX.Element {
        const searchResults: JSX.Element[] = [];
        let count: number = 0;
        for (const key of this.state.searchResult) {
            const recipeName: string | undefined = this.props.recipeNames.get(
                key
            );
            if (recipeName === undefined) {
                continue;
            }

            searchResults.push(
                <Link
                    to={`/recipes/${key}`}
                    onClick={this.handleClearSearch}
                    key={count}
                >
                    <MenuItem onClick={this.handleClose}>{recipeName}</MenuItem>
                </Link>
            );
            count++;
        }

        if (searchResults.length === 0) {
            // searchResults.push(
            //     <p className="subText" key="No_Result">
            //         No Results
            //     </p>
            // );
            for (const [key, value] of Array.from(this.props.recipeNames)) {
                searchResults.push(
                    <Link
                        to={`/recipes/${key}`}
                        onClick={this.handleClearSearch}
                        key={key}
                    >
                        <MenuItem onClick={this.handleClose}>{value}</MenuItem>
                    </Link>
                );
            }
        }

        let dropdown: JSX.Element = <span />;
        if (this.state.searchOpen) {
            dropdown = (
                <Paper className="searchResultsMenu" id="menu-list-grow">
                    <MenuList>{searchResults}</MenuList>
                </Paper>
            );
        }

        let searchBar: JSX.Element = (
            <IconButton
                onClick={() => {
                    this.setState({ searchOpen: true });
                }}
                className="searchicon"
                aria-label="Search for a Recipe"
            >
                <Search />
            </IconButton>
        );

        if (this.state.searchOpen) {
            searchBar = (
                <Input
                    className="searchField"
                    disableUnderline
                    placeholder="Search"
                    onChange={event => this.handleSearch(event.target.value)}
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
            );
        }

        return (
            <ClickAwayListener onClickAway={this.handleClearSearch}>
                <div>
                    <div
                        ref={(node: any) => {
                            this.anchorEl = node;
                        }}
                        aria-owns={
                            this.state.searchOpen ? "menu-list-grow" : ""
                        }
                        aria-haspopup="true"
                    >
                        {searchBar}
                    </div>
                    {dropdown}
                </div>
            </ClickAwayListener>
        );
    }
}
