import { Card, CardContent, Typography } from "@material-ui/core";

export function RecipeNotFound({ id }: { id: string }) {
    return (
        <Card
            style={{
                width: "90%",
                maxWidth: "600px",
                margin: "10vh auto",
                padding: "1vw",
            }}
        >
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    color="primary"
                >
                    Sorry, we couldn't find that recipe
                </Typography>
                We searched our database, but couldnt find anything matching "
                {id}". Try reloading the page or make sure the link you used is
                correct.
            </CardContent>
        </Card>
    );
}
