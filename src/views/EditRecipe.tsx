import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    IconButton,
    Snackbar,
    TextField,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Add, ArrowDownward, ArrowUpward, Delete } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { PageMissing } from "../components/PageMissing";
import { StarRating } from "../components/StarRating";
import { archiveRecipe, db } from "../firebase";
import { useRecipe } from "../hooks/useRecipe";
import { HACUser, Recipe } from "../modules";

function ArrayEditor({
    vals,
    onChange,
}: {
    vals: string[];
    onChange: (vals: string[]) => void;
}) {
    const [focusIdx, setFocusIdx] = useState(-1);
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
                        autoFocus={i === focusIdx}
                        onFocus={() => setFocusIdx(i)}
                        style={{
                            width: "calc(100% - 96px)",
                            verticalAlign: "middle",
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (vals[i + 1] === undefined) {
                                    onChange([...vals, ""]);
                                }
                                setFocusIdx(i + 1);
                            }
                        }}
                        value={val}
                        variant="outlined"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val[val.length - 1] === "\n") {
                                return;
                            }
                            vals[i] = val;
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
    const theme = useTheme();

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [coverImg, setCoverImg] = useState("");
    const [notes, setNotes] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [rating, setRating] = useState(0);

    const [isSaving, setIsSaving] = useState(false);
    const [alert, setAlert] = useState<{
        alert: string;
        status: "error" | "success";
    } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (recipe) {
            setTitle(recipe.title);
            setSubtitle(recipe.subtitle);
            setTags(recipe.tags);
            setCoverImg(recipe.coverImg);
            setNotes(recipe.notes);
            setIngredients(recipe.ingredients);
            setSteps(recipe.steps);
            setRating(recipe.rating);
        }
    }, [recipe]);

    function saveRecipe() {
        if (recipe) {
            const docRef = doc(db, "recipes", id);
            const newRecipe = new Recipe(
                id,
                title,
                subtitle,
                coverImg,
                notes,
                rating,
                tags,
                ingredients,
                steps
            );
            setIsSaving(true);
            console.log(`[EditRecipe] Saving`, newRecipe.toPlain());

            // update the search Ref collection
            setDoc(doc(db, "searchData", id), {
                data:
                    newRecipe.ingredients.join(";") +
                    newRecipe.title +
                    newRecipe.subtitle,
            });

            setDoc(docRef, newRecipe.toPlain())
                .then(() => {
                    setIsSaving(false);
                    setAlert({
                        alert: "Successfully saved recipe",
                        status: "success",
                    });
                    history.push(`/recipe/${id}`);
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
        return (
            <>
                <div
                    style={{ backgroundColor: theme.palette.primary.main }}
                    className="bgBanner"
                />
                <CenteredProgress
                    style={{ marginTop: "10vh", color: "white" }}
                />
            </>
        );
    }

    if (!recipe) {
        return <PageMissing id={id} />;
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
            <div
                style={{ backgroundColor: theme.palette.primary.main }}
                className="bgBanner"
            />
            <Card
                style={{
                    position: "relative",
                    maxWidth: "2000px",
                    width: "95%",
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Cover Image URL"
                                value={coverImg}
                                onChange={(e) => setCoverImg(e.target.value)}
                            />
                            {coverImg && (
                                <img
                                    alt="Cover Preview"
                                    src={coverImg}
                                    style={{
                                        maxWidth: "80%",
                                        margin: "20px auto",
                                        display: "block",
                                    }}
                                />
                            )}
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
                        <Grid
                            item
                            container
                            xs={12}
                            justifyContent="center"
                            style={{ marginTop: "200px" }}
                        >
                            <Grid item>
                                <Button
                                    onClick={() => setConfirmDialog(true)}
                                    color="primary"
                                >
                                    <Delete />
                                    Delete Recipe
                                </Button>
                            </Grid>
                            <Dialog
                                open={confirmDialog}
                                onClose={() => setConfirmDialog(false)}
                            >
                                <DialogContent>
                                    Are you sure you want to delete the recipe:
                                    <br />
                                    <br /> "{id}"
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        color="secondary"
                                        onClick={() => setConfirmDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            setIsDeleting(true);
                                            archiveRecipe(id).then(() => {
                                                setConfirmDialog(false);
                                                setIsDeleting(false);
                                                history.goBack();
                                                history.goBack();
                                            });
                                        }}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <CircularProgress
                                                style={{
                                                    height: "17px",
                                                    width: "17px",
                                                    marginRight: "11px",
                                                }}
                                            />
                                        ) : (
                                            <Delete />
                                        )}
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
