import * as React from "react";
import { Grid, Paper, Typography, GridList, GridListTile, GridListTileBar } from "@material-ui/core"
import { IconButton, Button } from "@material-ui/core";
import { Favorite } from '@material-ui/icons/'
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}

interface State {
    redirectRecipeKey: string
}

export interface Props {
    recipes: Map<string, recipe>,
    favRecipes: string[],
    onToggleFavourite: Function,
    title: string,
    maximum: number,
    seeMoreLink: string
}

export default class RecipeScroller extends React.Component<Props,State, object> {

    constructor(props: Props) {
        super(props)
        this.state = {
            redirectRecipeKey: ""

        }
    }

    handleRecipeClick(key: string): void {
        // location.href = '/recipes/' + key;
        this.setState({
            redirectRecipeKey: key
        })
    }

    render(): JSX.Element {

        // if we should redirect to the selected recipe redirect
        if(this.state.redirectRecipeKey !== ""){
            const key: string = this.state.redirectRecipeKey;
            this.setState({
                redirectRecipeKey: ""
            })
            return <Redirect push to={"/recipes/" + key} />;
        }

        const recipes: JSX.Element[] = [];
        let count: number = 0;
        for(const [key, val] of Array.from(this.props.recipes)) {
            if(count === this.props.maximum){
                recipes.push(
                    <Link to={this.props.seeMoreLink}>
                        <GridListTile 
                            key={key}
                            style={{cursor: 'pointer', minWidth: "180px", marginRight: "10px"}}
                        >
                            <Button style={{marginTop: "33px"}} >
                            See More...
                            </Button>
                        </GridListTile>
                    </Link>
                );
                break;
            }
            recipes.push(
                <GridListTile 
                    key={key} 
                    onClick={() => this.handleRecipeClick(key)} 
                    style={{cursor: 'pointer', minWidth: "180px"}}
                >
                    <Paper
                        style={{padding: "20px", margin: "5px", minHeight: "100px"}}
                    >
                        {val.title}
                    </Paper>
                    
                </GridListTile>
            )
            count++;
        }
        

        return(                
            <div style={{
                marginLeft: "5%",
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                overflow: 'hidden',
                marginTop: "30px",
            }}>
                <Typography variant="title" color="inherit" style={{marginBottom: "10px"}}>
                    {this.props.title}
                </Typography>
                <GridList cols={2.5} style={{flexWrap: 'nowrap', transform: 'translateZ(0)', height: "120px"}}>
                    {recipes}
                </GridList>
            </div>
        );
    }
}
 