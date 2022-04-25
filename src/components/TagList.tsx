import { Chip, Grid } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { fromID } from "../utils";

export function Tag({ tag }: { tag: string }) {
    return (
        <Link to={`/search/${encodeURIComponent(tag)}`}>
            <Chip
                style={{ cursor: "pointer" }}
                label={fromID(tag)}
                icon={<Search />}
                color="primary"
                variant="outlined"
            />
        </Link>
    );
}

export function TagList({ tags }: { tags: string[] }) {
    return (
        <div>
            <Grid container spacing={1}>
                {tags.map((tag, i) => (
                    <Grid item key={i}>
                        <Tag tag={tag} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
