import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeGrid } from "../components/RecipeGrid";
import { useSearchRecipes } from "../hooks/useSearchRecipes";
import { HACUser } from "../modules";

export function SearchView({ user }: { user: HACUser | null }) {
    let { searchPhrase } = useParams<{ searchPhrase: string }>();

    let decodedSearch;
    if (searchPhrase) {
        decodedSearch = decodeURIComponent(searchPhrase);
    }
    const [recipes, loading] = useSearchRecipes(
        decodedSearch?.split(" ") || []
    );

    return (
        <div
            style={{
                maxWidth: "1000px",
                width: "90%",
                margin: "5vh auto 5vh auto",
            }}
        >
            <Typography variant="h2" gutterBottom>
                Results for "{decodedSearch}"
            </Typography>
            {loading ? (
                <CenteredProgress style={{ marginTop: "10vh" }} />
            ) : (
                <RecipeGrid recipes={recipes} user={user} />
            )}
        </div>
    );
}
