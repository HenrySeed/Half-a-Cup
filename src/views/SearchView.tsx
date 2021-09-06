import { Typography, useTheme } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeGrid } from "../components/RecipeGrid";
import { useSearchRecipes } from "../hooks/useSearchRecipes";
import { HACUser } from "../modules";
import { fromID } from "../utils";

export function SearchView({ user }: { user: HACUser | null }) {
    let { searchPhrase } = useParams<{ searchPhrase: string }>();
    const theme = useTheme();

    let decodedSearch;
    if (searchPhrase) {
        decodedSearch = decodeURIComponent(searchPhrase);
    }
    const [recipes, loading] = useSearchRecipes(
        decodedSearch?.split(" ") || []
    );

    console.log(user);

    return (
        <>
            <div
                style={{ backgroundColor: theme.palette.primary.main }}
                className="bgBanner"
            ></div>
            <div
                style={{
                    position: "relative",
                    maxWidth: "1000px",
                    width: "90%",
                    margin: "5vh auto 5vh auto",
                }}
            >
                <Typography
                    variant="h2"
                    gutterBottom
                    style={{ color: "white" }}
                >
                    Results for "{fromID(decodedSearch || "")}"
                </Typography>
                {loading ? (
                    <CenteredProgress
                        style={{ marginTop: "10vh", color: "white" }}
                    />
                ) : (
                    <RecipeGrid recipes={recipes} user={user} />
                )}
            </div>
        </>
    );
}
