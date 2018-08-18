import * as React from "react";
import Paper from "@material-ui/core/Paper"
import Grid from '@material-ui/core/Grid';
import { Theme } from "@material-ui/core/styles";
import './RecipeTile.css';


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}


export interface Props {
    index: number
    thisRecipe: recipe,
    onOpen: Function
}

export default class RecipeTile extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e: any): void {
        if(this.props.onOpen){
            this.props.onOpen(this.props.index)
        }
    }

    render(): JSX.Element {
        return (
            <Paper className="recipeTile" onClick={this.handleClick}>
                <p>{this.props.thisRecipe.title}</p>
            </Paper>
        );
    }
}
