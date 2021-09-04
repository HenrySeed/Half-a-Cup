import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    Snackbar,
    TextField,
    Typography,
} from "@material-ui/core";
import { Add, ArrowDownward, ArrowUpward, Delete } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeNotFound } from "../components/RecipeNotFound";
import { StarRating } from "../components/StarRating";
import { db } from "../firebase";
import { useRecipe } from "../hooks/useRecipe";
import { HACUser } from "../modules";

function ArrayEditor({
    vals,
    onChange,
}: {
    vals: string[];
    onChange: (vals: string[]) => void;
}) {
    return (
        <Grid container spacing={1}>
            {vals.map((val, i) => (
                <Grid key={i} item xs={12}>
                    <ButtonGroup
                        orientation="vertical"
                        style={{ verticalAlign: "middle" }}
                    >
                        <IconButton
                            size="small"
                            disabled={i === 0}
                            onClick={() => {
                                const val = vals.splice(i, 1);
                                vals.splice(i - 1, 0, val[0]);
                                onChange(vals);
                            }}
                        >
                            <ArrowUpward />
                        </IconButton>
                        <IconButton
                            disabled={i === vals.length - 1}
                            size="small"
                            onClick={() => {
                                const val = vals.splice(i, 1);
                                vals.splice(i + 1, 0, val[0]);
                                onChange(vals);
                            }}
                        >
                            <ArrowDownward />
                        </IconButton>
                    </ButtonGroup>
                    <TextField
                        style={{
                            width: "calc(100% - 96px)",
                            verticalAlign: "middle",
                        }}
                        value={val}
                        variant="outlined"
                        onChange={(e) => {
                            vals[i] = e.target.value;
                            onChange(vals);
                        }}
                        multiline
                    />
                    <IconButton
                        color="primary"
                        onClick={() => {
                            vals.splice(i, 1);
                            onChange(vals);
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button
                    fullWidth
                    onClick={() => {
                        vals.push("");
                        onChange(vals);
                    }}
                    variant="text"
                >
                    <Add />
                </Button>
            </Grid>
        </Grid>
    );
}

export function EditRecipe({ user }: { user: HACUser | null }) {
    let { id } = useParams<{ id: string }>();
    const [recipe, loadingRecipe] = useRecipe(id);
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [rating, setRating] = useState(0);

    const [isSaving, setIsSaving] = useState(false);
    const [alert, setAlert] = useState<{
        alert: string;
        status: "error" | "success";
    } | null>(null);

    useEffect(() => {
        if (recipe) {
            setTitle(recipe.title);
            setSubtitle(recipe.subtitle);
            setTags(recipe.tags);
            setIngredients(recipe.ingredients);
            setSteps(recipe.steps);
            setRating(recipe.rating);
        }
    }, [recipe]);

    function saveRecipe() {
        if (recipe) {
            const docRef = doc(db, "recipes", id);
            const newRecipe = {
                title,
                subtitle,
                tags,
                ingredients,
                steps,
                rating,
            };
            setIsSaving(true);
            console.log(`[EditRecipe] Saving`, newRecipe);
            setDoc(docRef, newRecipe)
                .then(() => {
                    setIsSaving(false);
                    setAlert({
                        alert: "Successfully saved recipe",
                        status: "success",
                    });
                })
                .catch((error) => {
                    setIsSaving(false);
                    setAlert({
                        alert: `Error: ${error.message}`,
                        status: "error",
                    });
                });
        }
    }

    if (loadingRecipe) {
        return <CenteredProgress style={{ marginTop: "10vh" }} />;
    }

    if (!recipe) {
        return <RecipeNotFound id={id} />;
    }

    return (
        <>
            <Snackbar
                open={alert !== null}
                autoHideDuration={4000}
                onClose={() => setAlert(null)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert variant="filled" severity={alert?.status || "success"}>
                    {alert?.alert}
                </Alert>
            </Snackbar>
            <Card
                style={{
                    maxWidth: "1200px",
                    margin: "50px auto",
                }}
            >
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={8} lg={10}>
                            <Typography variant="h3">
                                Editing Recipe: {recipe.id}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            container
                            justifyContent="flex-end"
                            xs={12}
                            sm={4}
                            lg={2}
                            spacing={1}
                        >
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => history.goBack()}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => saveRecipe()}
                                >
                                    {isSaving && (
                                        <CircularProgress
                                            style={{
                                                height: "17px",
                                                width: "17px",
                                                marginRight: "11px",
                                            }}
                                        />
                                    )}
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Subtitle"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} container>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h3" gutterBottom>
                                    Tags
                                </Typography>
                                <ArrayEditor
                                    vals={tags}
                                    onChange={(vals) => setTags([...vals])}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="h3" gutterBottom>
                                        Rating
                                    </Typography>
                                    <StarRating
                                        value={rating}
                                        onChange={() => {}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h3" gutterBottom>
                                Ingredients
                            </Typography>
                            <ArrayEditor
                                vals={ingredients}
                                onChange={(vals) => setIngredients([...vals])}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h3" gutterBottom>
                                Instructions
                            </Typography>
                            <ArrayEditor
                                vals={steps}
                                onChange={(vals) => setSteps([...vals])}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
