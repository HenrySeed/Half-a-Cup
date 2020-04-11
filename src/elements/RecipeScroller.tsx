import * as React from "react";
import { Paper, Typography, CircularProgress } from "@material-ui/core";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

interface State {
  redirectRecipeKey: string;
}

export interface Props {
  title: string;
  recipeNames: Map<string, string>;
  favRecipes: string[];
  onToggleFavourite: Function;
  maximum: number;
  seeMoreLink: string;
  isLoading: boolean;
}

export default class RecipeScroller extends React.Component<
  Props,
  State,
  object
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectRecipeKey: "",
    };
  }

  handleRecipeClick(key: string): void {
    // location.href = '/recipes/' + key;
    this.setState({
      redirectRecipeKey: key,
    });
  }

  render(): JSX.Element {
    // if we should redirect to the selected recipe redirect
    if (this.state.redirectRecipeKey !== "") {
      const key: string = this.state.redirectRecipeKey;
      return <Redirect push to={"/recipes/" + key} />;
    }

    const recipes: JSX.Element[] = [];
    let index = 0;
    for (const [key, value] of Array.from(this.props.recipeNames)) {
      if (index === this.props.maximum) {
        recipes.push(
          <Link to={this.props.seeMoreLink} key={key}>
            <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
              <Button style={{ marginTop: "33px", width: "120px" }}>
                See More...
              </Button>
            </Grid>
          </Link>
        );
        break;
      }
      recipes.push(
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={key}
          onClick={() => this.handleRecipeClick(key)}
        >
          <Paper
            style={{
              padding: "20px",
              margin: "5px",
              minHeight: "100px",
            }}
          >
            {value}
          </Paper>
        </Grid>
      );
      index++;
    }

    return (
      <div
        style={{
          marginLeft: "5%",
          marginTop: "30px",
        }}
      >
        <Link to={this.props.seeMoreLink}>
          <Typography
            variant="title"
            color="inherit"
            style={{ marginBottom: "10px" }}
          >
            {this.props.title}
          </Typography>
        </Link>

        {this.props.isLoading ? (
          <CircularProgress
            style={{
              marginRight: "auto",
              marginLeft: "auto",
              display: "block",
              marginTop: "20px",
            }}
          />
        ) : (
          <span />
        )}
        <div style={{ flexGrow: 1 }}>
          <Grid container spacing={8}>
            {recipes}
          </Grid>
        </div>
      </div>
    );
  }
}
