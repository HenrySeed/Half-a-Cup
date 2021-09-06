import {
    Card,
    CardContent,
    Grid,
    IconButton,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Edit, MenuBook } from "@material-ui/icons";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { FavButton } from "../components/FavButton";
import { ReaderMode } from "../components/ReaderMode";
import { RecipeNotFound } from "../components/RecipeNotFound";
import { StarRating } from "../components/StarRating";
import { TagList } from "../components/TagList";
import { useRecipe } from "../hooks/useRecipe";
import { HACUser } from "../modules";
import "./RecipeView.css";

export function RecipeView({ user }: { user: HACUser | null }) {
    let { id } = useParams<{ id: string }>();
    const [recipe, loadingRecipe] = useRecipe(id);
    const [focusMode, setFocusMode] = useState(false);
    const theme = useTheme();
    const history = useHistory();

    if (loadingRecipe) {
        return (
            <>
                <div
                    style={{ backgroundColor: theme.palette.primary.main }}
                    className="bgBanner"
                ></div>
                <Card className="recipeContainer">
                    <CenteredProgress style={{ marginTop: "10vh" }} />
                </Card>
            </>
        );
    }

    if (recipe === null) {
        return <RecipeNotFound id={id} />;
    }

    if (focusMode) {
        return (
            <ReaderMode recipe={recipe} onClose={() => setFocusMode(false)} />
        );
    }

    console.log(user);

    return (
        <>
            <div
                style={{ backgroundColor: theme.palette.primary.main }}
                className="bgBanner"
            ></div>
            <Card className="recipeContainer">
                <CardContent>
                    <Grid container className="recipeHeader" spacing={3}>
                        <Grid item xs={12} sm={9} md={10}>
                            <Typography variant="h1" gutterBottom>
                                {recipe.title}
                            </Typography>
                            {recipe.subtitle && (
                                <Typography variant="subtitle1">
                                    {recipe.subtitle}
                                </Typography>
                            )}
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            md={2}
                            container
                            justifyContent="flex-end"
                            style={{ textAlign: "right" }}
                        >
                            <Grid item style={{ padding: "0 3px" }}>
                                {user && user?.isAdmin() && (
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            history &&
                                            history.push(`/edit/${recipe.id}`)
                                        }
                                    >
                                        <Edit />
                                    </IconButton>
                                )}
                            </Grid>
                            <Grid item style={{ padding: "0 3px" }}>
                                <FavButton user={user} recipeID={recipe.id} />
                            </Grid>
                            <Grid item style={{ padding: "0 3px" }}>
                                <IconButton
                                    size="small"
                                    onClick={() => setFocusMode(true)}
                                >
                                    <MenuBook />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            spacing={3}
                            style={{ marginBottom: "20px" }}
                        >
                            <Grid item xs={12} sm={4} container spacing={1}>
                                <span style={{ marginTop: "9px" }}>
                                    <StarRating
                                        value={recipe.rating}
                                        onChange={(val) =>
                                            console.log(
                                                "Changed rating to",
                                                val
                                            )
                                        }
                                    />
                                </span>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={8}
                                container
                                justifyContent="flex-end"
                            >
                                <TagList tags={recipe.tags} />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container spacing={3}>
                            <Grid item xs={12} md={4} lg={3}>
                                <div
                                    style={{
                                        position: "sticky",
                                        top: "20px",
                                        height: "fit-content",
                                    }}
                                >
                                    <Typography variant="h3">
                                        Ingredients
                                    </Typography>
                                    <ul>
                                        {recipe.ingredients.map(
                                            (ingredient, i) =>
                                                ingredient[0] === "#" ? (
                                                    <h3 key={i}>
                                                        {ingredient.slice(2)}
                                                    </h3>
                                                ) : (
                                                    <li key={i}>
                                                        {ingredient}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={8} lg={9}>
                                <Typography variant="h3">
                                    Instructions
                                </Typography>
                                <ul className="instructionList">
                                    {recipe.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
