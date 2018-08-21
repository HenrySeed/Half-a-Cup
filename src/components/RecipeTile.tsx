import * as React from "react";
import Paper from "@material-ui/core/Paper"
import './RecipeTile.css';


interface recipe {
    title: string,
    subtitle: string,
    tags: string[],
    ingredients: string[],
    steps: string[],
}


export interface Props {
    recipeKey: string;
    thisRecipe: recipe | undefined;
    onOpen: Function;
}

export default class RecipeTile extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e: any): void {
        if(this.props.onOpen){
            this.props.onOpen(this.props.recipeKey)
        }
    }

    render(): JSX.Element {
        if(this.props.thisRecipe === undefined){
            return <span/>
        }
        return (
            <Paper className="recipeTile" onClick={this.handleClick}>
                <p>{this.props.thisRecipe.title}</p>
            </Paper>
        );
    }
}
