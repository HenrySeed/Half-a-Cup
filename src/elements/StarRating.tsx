import * as React from "react";
import { Star, StarBorder } from '@material-ui/icons/'


export interface Props {
    value: number,
    onChangeVal: Function
}

export interface State {
    currentVal: number
}

export default class StarRating extends React.Component<Props, State, object> {

    constructor(props: Props) {
        super(props)

        this.state = {
            currentVal: props.value
        }

        this.updateCurrentVal = this.updateCurrentVal.bind(this);
        this.resetVal = this.resetVal.bind(this)
    }

    updateCurrentVal(value: number): void{
        this.setState({
            currentVal: value+1
        })
    }

    resetVal(): void {
        this.setState({
            currentVal: this.props.value
        })
    }

    render(): JSX.Element {
        const stars: JSX.Element[] = [];

        if(this.props.value > this.state.currentVal){

            for(let activeI: number = 0; activeI < this.state.currentVal; activeI++){
                stars.push(
                    <Star 
                        className="activeStar" 
                        key={activeI}
                        onMouseEnter={() => this.updateCurrentVal(activeI)} 
                        onMouseLeave={this.resetVal} 
                        onClick={() => this.props.onChangeVal(activeI+1)}/>
                )
            }
            for(let activeI: number = this.state.currentVal; activeI  < this.props.value; activeI++){
                stars.push(
                    <StarBorder 
                        style={{"color": "#f44336"}} 
                        key={activeI}
                        onMouseEnter={() => this.updateCurrentVal(activeI)} 
                        onMouseLeave={this.resetVal} 
                        onClick={() => this.props.onChangeVal(activeI+1)}/>
                )
            }
            for(let activeI: number = this.props.value; activeI  < 5; activeI++){
                stars.push(
                    <StarBorder 
                        className="star" 
                        key={activeI}
                        onMouseEnter={() => this.updateCurrentVal(activeI)} 
                        onMouseLeave={this.resetVal} 
                        onClick={() => this.props.onChangeVal(activeI+1)}/>
                )
            }

        } else {
            for(let activeI: number = 0; activeI < this.props.value; activeI++){
                stars.push(
                    <Star 
                        className="activeStar" 
                        key={activeI}
                        onMouseEnter={() => this.updateCurrentVal(activeI)} 
                        onMouseLeave={this.resetVal} 
                        onClick={() => this.props.onChangeVal(activeI+1)}/>
                )
            }
            for(let activeI: number = this.props.value; activeI  < this.state.currentVal; activeI++){
                stars.push(
                    <StarBorder 
                        style={{"color": "#f44336"}} 
                        key={activeI}
                        onMouseEnter={() => this.updateCurrentVal(activeI)} 
                        onMouseLeave={this.resetVal} 
                        onClick={() => this.props.onChangeVal(activeI+1)}/>
                )
            }
            for(let activeI: number = this.state.currentVal; activeI  < 5; activeI++){
                stars.push(
                    <StarBorder 
                        className="star" 
                        key={activeI}
                        onMouseEnter={() => this.updateCurrentVal(activeI)} 
                        onMouseLeave={this.resetVal} 
                        onClick={() => this.props.onChangeVal(activeI+1)}/>
                )
            }
        }
        
        return(
            <div>
                {stars}
            </div>
        );
    }
}
 