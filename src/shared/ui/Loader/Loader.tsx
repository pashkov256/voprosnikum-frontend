import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import styles from "./Loader.module.scss";
function Loader({ style }:{style?:any}) {
    return (
        <div className={styles.Loader} style={style}>
            <CircularProgress style={{ color: "#01a1d5" }} />
        </div>
    );
}

export default Loader;
