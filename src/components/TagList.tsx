import { Chip, Grid } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { fromID } from "../utils";

export function Tag({ tag }: { tag: string }) {
    const history = useHistory();

    const chipOnClick = useCallback(
        (val: string) => history.push(`/search/${encodeURIComponent(val)}`),
        [history]
    );

    return (
        <Chip
            onClick={() => chipOnClick(tag)}
            label={fromID(tag)}
            icon={<Search />}
            color="primary"
            variant="outlined"
        />
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
