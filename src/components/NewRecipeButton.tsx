import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { HACUser, Recipe } from "../modules";
import { toID } from "../utils";

export function NewRecipeButton({ user }: { user: HACUser | null }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [recipeName, setRecipeName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const history = useHistory();

    /**
     * Makes a blank recipe and saves it to the DB, once done it redirects to edit page
     * @param {string} recipeName
     * @returns
     */
    async function createRecipe(recipeName: string) {
        const id = toID(recipeName);
        const docRef = doc(db, "recipes", id);
        setIsLoading(true);

        // make sure the id doesnt already exist
        if ((await getDoc(docRef)).exists()) {
            setError("That recipe name already exists");
            setIsLoading(false);
            return;
        }

        // first make a blank recipe
        const recipe = new Recipe(id, recipeName, "", "", "", 0, [], [], []);

        // save it to the DB
        await setDoc(docRef, recipe.toPlain());
        setIsLoading(false);

        // redirect to the edit page for the new recipe
        history.push(`/edit/${id}`);
        setDialogOpen(false);
        setRecipeName(null);
    }

    return (
        <>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create a new Recipe</DialogTitle>
                <DialogContent>
                    <TextField
                        color="secondary"
                        style={{ width: "300px" }}
                        value={recipeName || ""}
                        onChange={(e) => {
                            setRecipeName(e.target.value);
                            setError("");
                        }}
                        fullWidth
                        autoFocus
                        label="Recipe Name"
                        error={error !== "" || recipeName === ""}
                        helperText={
                            error ||
                            (recipeName === "" && "The Recipe needs a name")
                        }
                    />
                    {recipeName !== null && recipeName !== "" && (
                        <p>
                            <b>Generated ID:</b>
                            <br />
                            {toID(recipeName || "")}
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            createRecipe(recipeName || "");
                        }}
                        disabled={!history || !recipeName || error !== ""}
                    >
                        {isLoading && (
                            <CircularProgress
                                style={{
                                    height: "17px",
                                    width: "17px",
                                    marginRight: "11px",
                                }}
                            />
                        )}
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
            {user?.isAdmin() && (
                <IconButton
                    style={{
                        color: "white",
                        marginRight: "10px",
                    }}
                    onClick={() => setDialogOpen(true)}
                >
                    <Add />
                </IconButton>
            )}
        </>
    );
}
