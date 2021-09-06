import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { HACUser, Recipe } from "../modules";
import { FavButton } from "./FavButton";
import { Tag } from "./TagList";

export function RecipeCard({
    user,
    recipe,
}: {
    user: HACUser | null;
    recipe: Recipe;
}) {
    const history = useHistory();
    const handleOnClick = useCallback(
        () => history.push(`/recipe/${recipe.id}`),
        [history, recipe.id]
    );

    return (
        <Card
            style={{
                position: "relative",
                minHeight: "225px",
            }}
        >
            <CardActionArea onClick={handleOnClick} style={{ height: "130px" }}>
                <CardContent>
                    <Typography gutterBottom variant="h5">
                        {recipe.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                        style={{
                            overflowY: "hidden",
                            height: "44px",
                        }}
                    >
                        {recipe.subtitle}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions
                style={{
                    padding: "0 14px 14px 14px",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                }}
            >
                <Grid container justifyContent="flex-end" spacing={2}>
                    <Grid
                        item
                        container
                        spacing={1}
                        style={{ height: "50px", overflowY: "hidden" }}
                    >
                        {recipe.tags.map((val, i) => (
                            <Grid item key={i}>
                                <Tag tag={val} />
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item>
                        {user?.uid === "bWcWTtHgkJaw0RK2EPqIV9KKUfw2" && (
                            <Tooltip title={"Edit Recipe"}>
                                <Link to={`/edit/${recipe.id}`}>
                                    <IconButton size="small" color="primary">
                                        <Edit />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        )}
                        <FavButton user={user} recipeID={recipe.id} />
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}
