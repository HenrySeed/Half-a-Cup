import {
    Button,
    CardContent,
    Grid,
    Typography,
    useTheme,
} from "@material-ui/core";
import "../views/RecipeView.css";
import { Link } from "react-router-dom";

export function PageMissing({ id }: { id?: string }) {
    const theme = useTheme();
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
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h1"
                        component="h2"
                        color="textPrimary"
                    >
                        404 - Page Missing
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        style={{ fontSize: "1.1em" }}
                    >
                        {id
                            ? `We searched, but couldnt find anything matching "${id}". `
                            : `We searched, but couldnt find that page. `}
                        Try reloading the page or make sure the link you used is
                        correct.
                    </Typography>
                    <br />
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        style={{ fontSize: "1.1em" }}
                    >
                        You can browse all recipes on the home page
                    </Typography>
                    <Grid
                        container
                        justifyContent="center"
                        style={{ marginTop: "40px" }}
                    >
                        <Link to="/">
                            <Button
                                style={{
                                    borderColor: theme.palette.text.primary,
                                    fontSize: "12pt",
                                    padding: "8px 18px",
                                }}
                            >
                                Home
                            </Button>
                        </Link>
                    </Grid>
                </CardContent>
            </div>
        </>
    );
}
