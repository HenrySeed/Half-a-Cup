import { IconButton, Tooltip } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { HACUser } from "../modules";

export function FavButton({
    user,
    recipeID,
}: {
    user: HACUser | null;
    recipeID: string;
}) {
    if (user) {
        const isFav = user.hasSaved(recipeID);
        return (
            <Tooltip title={isFav ? "Unfavourite Recipe" : "Favourite Recipe"}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                        isFav
                            ? user.unFavRecipe(recipeID)
                            : user.favRecipe(recipeID);
                    }}
                >
                    {isFav ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
            </Tooltip>
        );
    }
    return <></>;
}
