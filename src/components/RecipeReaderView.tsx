import * as React from "react";
import { Close, NavigateNext, NavigateBefore } from "@material-ui/icons/";
import { IconButton, Button, CircularProgress } from "@material-ui/core";
import "./RecipeReaderView.css";
import * as ReactSwipe from "react-swipe";
import Paper from "@material-ui/core/Paper";
import { WithTheme, withTheme } from "@material-ui/core";
import {
  ingredient,
  split_num_ingredient,
  getIngredientsForStep,
} from "src/resources/recipeUtilities";

interface recipe {
  title: string;
  subtitle: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
}

interface State {
  currentPageNum: number;
}

export interface Props extends WithTheme {
  recipe: recipe;
  isLoading: boolean;
}

class RecipeReaderViewNoStyle extends React.Component<Props, State, object> {
  reactSwipe: any;

  hasNextPage: boolean;
  hasPrevPage: boolean;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPageNum: 0,
    };
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handlePrevButton = this.handlePrevButton.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.getIngredientsListForStep = this.getIngredientsListForStep.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener("keydown", this.handleKeypress, false);
  }
  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKeypress, false);
  }

  handleKeypress(event: any): void {
    if (event.keyCode === 27) {
      window.history.back();
    } else if (event.keyCode === 37 && this.hasPrevPage) {
      this.handlePrevButton();
    } else if (event.keyCode === 39 && this.hasNextPage) {
      this.handleNextButton();
    }
  }

  // handles the press of the next button
  handleNextButton(): void {
    this.setState({
      currentPageNum: this.reactSwipe.getPos() + 1,
    });
    this.reactSwipe.next();
  }
  // handles the press of the previous button
  handlePrevButton(): void {
    this.setState({
      currentPageNum: this.reactSwipe.getPos() - 1,
    });
    this.reactSwipe.prev();
  }

  // handles the counter updater when the pages are changed by swipe
  handlePageChange(): void {
    this.setState({
      currentPageNum: this.reactSwipe.getPos(),
    });
    // reset the vertical scroll position on page change
    // const myDiv = document.getElementById("swipeCarousel");
    // if (myDiv !== null) {
    //     myDiv.scrollTop = 0;
    // }
    window.scrollTo(0, 0);
  }

  getIngredientsListForStep(ingr: ingredient[]): JSX.Element {
    let count = 0;
    return (
      <span>
        <h4 style={{ margin: "40px 0px 0px 0px", fontWeight: "normal" }}>
          Related Ingredients
        </h4>
        <ul style={{ fontSize: "14pt" }}>
          {ingr.map((val) => {
            count++;
            return <li key={count}>{val.originalText}</li>;
          })}
        </ul>
      </span>
    );
  }

  render(): JSX.Element {
    const tempPages: JSX.Element[] = [];
    let count: number = 0;

    let ingredientItems: ingredient[] = [];
    for (const i of this.props.recipe.ingredients) {
      ingredientItems.push(split_num_ingredient(i));
    }

    const ingredients: JSX.Element[] = this.props.recipe.ingredients.map(
      function (ingredient: any, i: any): any {
        count++;
        return <li key={count}>{ingredient}</li>;
      }
    );

    tempPages.push(
      <span>
        <h3
          style={{
            fontSize: "34pt",
            marginBottom: "20px",
            marginTop: "0px",
            color: this.props.theme.palette.primary.main,
          }}
        >
          Ingredients
        </h3>
        <ul>{ingredients}</ul>
      </span>
    );

    for (const step of this.props.recipe.steps) {
      const ingr = getIngredientsForStep(step, ingredientItems);
      ingredientItems = ingredientItems.filter((val) => ingr.indexOf(val) < 0);

      tempPages.push(
        <span>
          {step}
          {ingr.length !== 0 ? this.getIngredientsListForStep(ingr) : <span />}
        </span>
      );
    }

    this.hasNextPage = tempPages[this.state.currentPageNum + 1] !== undefined;
    this.hasPrevPage = tempPages[this.state.currentPageNum - 1] !== undefined;

    const swipeOptions = {
      continuous: false,
      callback: () => {
        this.handlePageChange();
      },
    };

    const swiper = (
      <span>
        <ReactSwipe
          ref={(reactSwipe) => (this.reactSwipe = reactSwipe)}
          className="carousel"
          id="swipeCarousel"
          key={tempPages.length}
          swipeOptions={swipeOptions}
        >
          {tempPages.map(function (page: any, i: any): any {
            return (
              <span key={i} className="stepContainer">
                <Paper className="stepText">{page}</Paper>
              </span>
            );
          })}
        </ReactSwipe>
        <div className="controlPanel">
          {this.hasPrevPage ? (
            <Button
              variant="fab"
              color="default"
              aria-label="Next"
              className="prevButton"
              onClick={this.handlePrevButton}
            >
              <NavigateBefore />
            </Button>
          ) : (
            <span />
          )}
          {this.hasNextPage ? (
            <Button
              variant="fab"
              aria-label="Next"
              className="nextButton"
              onClick={this.handleNextButton}
            >
              <NavigateNext />
            </Button>
          ) : (
            <span />
          )}
        </div>
      </span>
    );

    return (
      <div
        className="readerViewContainer"
        style={{
          zIndex: 1100,
          width: "100%",
          height: "auto",
          minHeight: "calc(100% - 70px)",
          top: "70px",
          paddingTop: "20px",
          margin: "0",
          backgroundColor: this.props.theme.palette.primary.main,
          position: "absolute",
          color: "#333",
        }}
      >
        <IconButton
          style={{
            color: "#FFFFFF",
            position: "fixed",
            top: "0",
            right: "0",
            margin: "5px 20px 3px 0px",
            backgroundColor: this.props.theme.palette.primary.main,
          }}
          className="readerCloseButton"
          onClick={() => window.history.back()}
          aria-label="Close this view"
        >
          <Close />
        </IconButton>
        {this.props.isLoading ? (
          <CircularProgress
            style={{
              marginRight: "auto",
              marginLeft: "auto",
              display: "block",
              marginTop: "10vh",
            }}
            color="secondary"
          />
        ) : (
          swiper
        )}
      </div>
    );
  }
}

const RecipeReaderView = withTheme()(RecipeReaderViewNoStyle); // 3
export default RecipeReaderView;
