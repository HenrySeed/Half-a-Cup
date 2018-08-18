import * as React from "react";
import Paper from "@material-ui/core/Paper"
import Grid from '@material-ui/core/Grid';
import { Theme } from "@material-ui/core/styles";
import './RecipeTile.css';
import Close from '@material-ui/icons/Close'
import "./OpenRecipe"
import { IconButton } from "../../node_modules/@material-ui/core";


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
}

export default class OpenRecipe extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e: any): void {
        if(this.props.onClose){
            this.props.onClose()
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

        return (
            <Paper className="recipeTile">
                <IconButton  onClick={this.handleClick} className="close">
                    <Close/>
                </IconButton>
                
                <p>{this.props.thisRecipe.title}</p>
                <p>{this.props.thisRecipe.subtitle}</p>
                <p>{this.props.thisRecipe.tags}</p>

                <p>Ingredients</p>
                <ul>{ingredients}</ul>

                <p>Steps</p>
                <ul>{steps}</ul>
            </Paper>
            
        );
    }
}
