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
  onSearchValChange: Function;
}

export interface State {
  searchResult: string[];
  lastSearch: string;
  searchOpen: boolean;
}

export default class SearchBar extends React.Component<Props, State, object> {
  anchorEl: any;

  constructor(props: Props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);

    this.state = {
      searchResult: [],
      lastSearch: "",
      searchOpen: false,
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
    this.props.onSearchValChange(str);

    if (str.trim() === "") {
      this.setState({
        searchResult: [],
      });
      return;
    }

    const words: string[] = str.split(" ");
    const foundRecipes: string[] = [];

    for (const recipeKey of Array.from(this.props.allRecipeTags.keys())) {
      let allTagsFound: boolean = true;
      const recipeTags: string[] | undefined = this.props.allRecipeTags.get(
        recipeKey
      );
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
      lastSearch: str,
      searchResult: foundRecipes,
    });
  }

  componentDidUpdate(): void {
    if (this.props.value !== "" && this.props.value !== this.state.lastSearch) {
      this.setState({ searchOpen: true });
      this.handleSearch(this.props.value);
    }
  }

  handleClearSearch(event: any): void {
    this.handleSearch("");
    this.props.onSearchValChange("");
    this.props.onSearchClear();
    this.handleClose();
  }

  handleClose(): void {
    this.setState({ searchOpen: false });
  }

  getResultsList(): JSX.Element[] {
    const searchResults: JSX.Element[] = [];
    this.state.searchResult.forEach((key, index) => {
      const recipeName: string | undefined = this.props.recipeNames.get(key);
      if (recipeName === undefined) {
        return;
      }
      searchResults.push(
        <Link to={`/recipes/${key}`} key={index}>
          <MenuItem onClick={this.handleClose}>{recipeName}</MenuItem>
        </Link>
      );
    });

    // if we got no results
    if (searchResults.length === 0) {
      // if we searched with a real value (not just whitespace) print a message saying we didnt find anythign
      if (this.props.value.replace(/\s/, "") !== "") {
        searchResults.push(
          <p className="subText" key="No_Result">
            We couldnt find any recipes matching "{this.props.value}"
          </p>
        );
      }
      // if we searched or not, with no results, we show a list of popular recipes
      searchResults.push(
        <p className="popularRecipesTitle" key="No_Result">
          Popular Recipes
        </p>
      );

      for (const [key, value] of Array.from(this.props.recipeNames).slice(
        0,
        5
      )) {
        searchResults.push(
          <Link
            to={`/recipes/${key}`}
            key={key}
            onClick={this.handleClearSearch}
          >
            <MenuItem>{value}</MenuItem>
          </Link>
        );
      }
      searchResults.push(
        <Link to={`/recipes`} onClick={this.handleClearSearch} key={"viewALL"}>
          <MenuItem style={{ fontWeight: "bold" }}>View all recipes</MenuItem>
        </Link>
      );
    }
    // if we did get results, we can just return them
    return searchResults;
  }

  render(): JSX.Element {
    const searchResults: JSX.Element[] = this.getResultsList();

    let dropdown: JSX.Element = <span />;
    if (this.state.searchOpen) {
      dropdown = (
        <Paper className="searchResultsMenu" id="menu-list-grow">
          <MenuList>{searchResults}</MenuList>
        </Paper>
      );
    }

    let searchBar: JSX.Element = (
      <Input
        className="searchField searchFieldInactive"
        disableUnderline
        placeholder="Search"
        value={this.props.value}
        onClick={() => this.setState({ searchOpen: true })}
        endAdornment={
          <InputAdornment position="start">
            <IconButton aria-label="Search">
              <Search />
            </IconButton>
          </InputAdornment>
        }
      />
    );

    if (this.state.searchOpen) {
      searchBar = (
        <Input
          className="searchField"
          disableUnderline
          placeholder="Search"
          onChange={(event) => this.handleSearch(event.target.value)}
          value={this.props.value}
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
      <ClickAwayListener onClickAway={this.handleClose}>
        <div
          style={{
            width: "calc(100%)",
            display: "block",
            maxWidth: "500px",
            marginLeft: "20px",
            marginTop: "0px",
          }}
        >
          <div
            ref={(node: any) => {
              this.anchorEl = node;
            }}
            aria-owns={this.state.searchOpen ? "menu-list-grow" : ""}
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
