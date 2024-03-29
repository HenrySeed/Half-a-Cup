import {
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
import { PageMissing } from "../components/PageMissing";
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
                    className="bgBanner"
                    style={{
                        backgroundColor: theme.palette.primary.main,
                        height: "300px",
                    }}
                ></div>
                <div
                    className="recipeContainer"
                    style={{ backgroundColor: theme.palette.background.paper }}
                >
                    <CenteredProgress style={{ marginTop: "10vh" }} />
                </div>
            </>
        );
    }

    if (recipe === null) {
        return <PageMissing id={id} />;
    }

    if (focusMode) {
        return (
            <ReaderMode recipe={recipe} onClose={() => setFocusMode(false)} />
        );
    }

    return (
        <>
            <div
                style={{
                    backgroundColor: theme.palette.primary.main,
                    height: "300px",
                }}
                className="bgBanner"
            ></div>
            <div
                className="recipeContainer"
                style={{ backgroundColor: theme.palette.background.paper }}
            >
                {recipe.coverImg && (
                    <div
                        className="recipeCoverImg"
                        style={{
                            backgroundImage: `url(${recipe.coverImg})`,
                        }}
                    />
                )}
                <CardContent>
                    <Grid container className="recipeHeader" spacing={3}>
                        <Grid item xs={12} sm={9} md={10}>
                            <Typography
                                variant="h1"
                                gutterBottom
                                color="textPrimary"
                            >
                                {recipe.title}
                            </Typography>
                            {recipe.subtitle && (
                                <Typography
                                    variant="subtitle1"
                                    color="textSecondary"
                                >
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
                        <Grid item xs={12} style={{ marginBottom: "20px" }}>
                            <TagList tags={recipe.tags} />
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
                                    <Typography
                                        variant="h3"
                                        color="textPrimary"
                                    >
                                        Ingredients
                                    </Typography>
                                    <ul className="ingredientsList">
                                        {recipe.ingredients.map(
                                            (ingredient, i) =>
                                                ingredient[0] === "#" ? (
                                                    <Typography
                                                        variant="h4"
                                                        className="ingredientHeading"
                                                        color="textPrimary"
                                                    >
                                                        {ingredient.slice(2)}
                                                    </Typography>
                                                ) : (
                                                    <li key={i}>
                                                        <Typography
                                                            variant="body1"
                                                            color="textPrimary"
                                                        >
                                                            {ingredient}
                                                        </Typography>
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={8} lg={9}>
                                <Typography variant="h3" color="textPrimary">
                                    Instructions
                                </Typography>
                                <ul className="instructionList">
                                    {recipe.steps.map((step, i) => (
                                        <li key={i}>
                                            <Typography
                                                variant="body1"
                                                color="textPrimary"
                                            >
                                                {step}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </div>
        </>
    );
}
