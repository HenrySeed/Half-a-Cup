import * as React from "react";
import Paper from "@material-ui/core/Paper"
import Close from '@material-ui/icons/Close'
import "./OpenRecipe.css"
import { IconButton, Button } from "@material-ui/core";


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}


export interface Props {
    thisRecipe: recipe;
    onClose: Function;
    onTagClick: Function
}

export default class OpenRecipe extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleTagClick = this.handleTagClick.bind(this)
    }

    handleClick(e: any): void {
        if(this.props.onClose){
            this.props.onClose()
        }
    }

    handleTagClick(e: any, str: string): void {
        if(this.props.onTagClick){
            this.props.onTagClick(str.trim())
        }
    }

    render(): JSX.Element {

        let ingredients: JSX.Element[] = []

        for(const ingredient of this.props.thisRecipe.ingredients){
            ingredients.push(
                <li>
                    {ingredient}
                </li>
            )
        }

        let steps: JSX.Element[] = []

        for(const step of this.props.thisRecipe.steps){
            steps.push(
                <li>
                    {step}
                </li>
            )
        }

        let tags: JSX.Element[] = []

        for(const tag of this.props.thisRecipe.tags){
            tags.push(
                <Button 
                    className="tagButton"
                    onClick={(e) => {this.handleTagClick(e, tag)}} 
                    color="primary" 
                    variant="contained"
                >
                    {tag}
                </Button>
            )
        }

        return (
            <Paper className="recipeTile">
                <IconButton className="close" onClick={this.handleClick}>
                    <Close/>
                </IconButton>
                
                <h3>{this.props.thisRecipe.title}</h3>
                <em>{this.props.thisRecipe.subtitle}</em>

                <h4>Ingredients</h4>
                <ul>{ingredients}</ul>

                <h4>Steps</h4>
                <ul>{steps}</ul>
                <br/><br/><br/>
                <hr/>
                <br/><br/>
                Tags for this Recipe 
                <br/>
                <br/>
                {tags}
                <br/><br/>

            </Paper>
            
        );
    }
}
