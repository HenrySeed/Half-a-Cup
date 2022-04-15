import {
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Theme,
    Tooltip,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { HACUser, Recipe } from "../modules";
import { FavButton } from "./FavButton";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        marginBottom: "0.3em",
        textTransform: "uppercase",
        fontSize: "2rem",
    },
    highlight: {
        "@media (hover: hover)": {
            "&:hover": {
                display: "inline",
                background: `${theme.palette.primary.main}`,
                color: "#fff",
                padding: "0.25em",
                paddingLeft: 0,
                paddingRight: 0,
                boxShadow: `10px 0 0 ${theme.palette.primary.main}, -10px 0 0 ${theme.palette.primary.main}`,
                zIndex: -1,
            },
        },
    },
}));

export function RecipeCard({
    user,
    recipe,
    wide,
}: {
    user: HACUser | null;
    recipe: Recipe;
    wide?: boolean;
}) {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div>
            <CardContent>
                <Grid container spacing={4}>
                    {recipe.coverImg && (
                        <Grid item xs={12} md={wide ? 7 : 12}>
                            <Link to={`/recipe/${recipe.id}`}>
                                <CardMedia
                                    style={{
                                        height: wide ? "600px" : "180px",
                                        borderRadius: "30px",
                                    }}
                                    image={recipe.coverImg || ""}
                                    title={recipe.title}
                                />
                            </Link>
                        </Grid>
                    )}
                    <Grid item xs={12} md={wide ? 5 : 12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Link to={`/recipe/${recipe.id}`}>
                                    <Typography
                                        color="textPrimary"
                                        variant={"h2"}
                                        className={classes.title}
                                    >
                                        <span className={classes.highlight}>
                                            {recipe.title}
                                        </span>
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={12} style={{ marginBottom: "10px" }}>
                                {user?.uid ===
                                    "bWcWTtHgkJaw0RK2EPqIV9KKUfw2" && (
                                    <Tooltip title={"Edit Recipe"}>
                                        <Link
                                            to={`/edit/${recipe.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <IconButton
                                                size="small"
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    </Tooltip>
                                )}
                                <FavButton user={user} recipeID={recipe.id} />
                            </Grid>
                        </Grid>

                        {(!recipe.coverImg || wide) && (
                            <>
                                <div
                                    style={{
                                        overflowY: "hidden",
                                        maxHeight: wide ? "520px" : "150px",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                    >
                                        {recipe.subtitle}
                                    </Typography>
                                    <ul
                                        style={{
                                            listStyle: "none",
                                            margin: "10px 0 0 0",
                                        }}
                                    >
                                        {recipe.ingredients.map(
                                            (val, index) => (
                                                <li
                                                    style={{ margin: "5px" }}
                                                    key={index}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        color="textSecondary"
                                                    >
                                                        {val}
                                                    </Typography>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                {recipe.subtitle && (
                                    <div style={{ textAlign: "center" }}>
                                        ...
                                    </div>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
        </div>
    );
}
