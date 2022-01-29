import {
    Button,
    Card,
    CardContent,
    IconButton,
    useTheme,
} from "@material-ui/core";
import { Close, NavigateBefore, NavigateNext } from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import ReactSwipe from "react-swipe";
import { Recipe } from "../modules";
import { getIngredientName } from "../utils";
import "./ReaderMode.css";

export function ReaderMode({
    recipe,
    onClose,
}: {
    recipe: Recipe;
    onClose: () => void;
}) {
    const [pageNum, setPageNum] = useState(0);
    let swiper = useRef<any>();
    const theme = useTheme();

    useEffect(() => {
        const arrowListener = (e: any) => {
            if (e.key === "ArrowLeft") {
                swiper.current.prev();
            }
            if (e.key === "ArrowRight") {
                swiper.current.next();
            }
        };

        document.addEventListener("keydown", arrowListener);
        return () => document.removeEventListener("keydown", arrowListener);
    }, [swiper]);

    let ingredientNames = recipe.ingredients.map((ingr) =>
        getIngredientName(ingr)
    );

    console.log(ingredientNames);

    const recipeSteps: { step: string; ingredients: string[] }[] = [];
    for (const step of recipe.steps) {
        const usedIngredients: string[] = [];
        const remaining: string[] = [];

        ingredientNames.forEach((val, i) => {
            // find any ingredients in step
            if (step.includes(val)) {
                usedIngredients.push(val);
            } else {
                remaining.push(val);
            }
        });
        ingredientNames = remaining;
        recipeSteps.push({ step: step, ingredients: usedIngredients });
    }

    console.log(recipeSteps);

    return (
        <div>
            <div
                style={{ backgroundColor: theme.palette.primary.main }}
                className="fullbgBanner"
            ></div>
            <span className="closeButton">
                <IconButton onClick={onClose}>
                    <Close style={{ color: "white" }} />
                </IconButton>
            </span>
            <ReactSwipe
                ref={(reactSwipe: any) => (swiper.current = reactSwipe)}
                className="carousel"
                swipeOptions={{
                    continuous: false,
                    callback: () => {
                        setPageNum(swiper.current.getPos());
                        window.scrollTo(0, 0);
                    },
                    disableScroll: false,
                }}
            >
                {recipeSteps.map((page, i) => (
                    <span className="swipePanelContainer">
                        <Card key={i} className="swipePanel">
                            <CardContent>
                                {page.step}
                                <ul>
                                    {page.ingredients.map((val) => (
                                        <li>{val}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </span>
                ))}
            </ReactSwipe>
            <div className="controlPanel">
                <div>
                    {pageNum > 0 && (
                        <Button
                            color="primary"
                            variant="contained"
                            className="prevButton"
                            onClick={() => {
                                swiper.current.prev();
                            }}
                        >
                            <NavigateBefore />
                        </Button>
                    )}
                    {recipe.steps[pageNum + 1] !== undefined && (
                        <Button
                            color="primary"
                            variant="contained"
                            className="nextButton"
                            onClick={() => {
                                swiper.current.next();
                            }}
                        >
                            <NavigateNext />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
