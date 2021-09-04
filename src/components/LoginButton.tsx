import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    UserCredential,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, googleAUthProvider } from "../firebase";
import { HACUser } from "../modules";
import googleIcon from "../res/SVG/googleIcon.svg";

export function LoginButton({
    user,
    onUserChange,
}: {
    user: HACUser | null;
    onUserChange: (user: HACUser | null) => void;
}) {
    const [loggedIn, setLoggedIn] = useState(true);
    const [loginOpen, setLoginOpen] = useState(false);

    return (
        <>
            {user ? (
                <Button
                    style={{
                        float: "right",
                        color: "white",
                        borderColor: "white",
                    }}
                    onClick={() => setLoggedIn(false)}
                >
                    Logout
                </Button>
            ) : (
                <Button
                    style={{
                        float: "right",
                        color: "white",
                        borderColor: "white",
                    }}
                    onClick={() => setLoginOpen(true)}
                >
                    Login
                </Button>
            )}
            <LoginDialog
                user={user}
                open={loginOpen}
                onUserChange={onUserChange}
                loggedIn={loggedIn}
                onClose={() => setLoginOpen(false)}
            />
        </>
    );
}

export function LoginDialog({
    user,
    open,
    loggedIn,
    onUserChange,
    onClose,
}: {
    user: HACUser | null;
    open: boolean;
    loggedIn: boolean;
    onUserChange: (user: HACUser | null) => void;
    onClose: () => void;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState<{
        alert: string;
        status: "error" | "success";
    } | null>(null);

    const [emailLogin, setEmailLogin] = useState(true);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

    // Watch for the loggenIn boolean changing, if false log the user out
    useEffect(() => {
        if (!loggedIn && user) {
            const auth = getAuth();
            signOut(auth)
                .then(() => {
                    notify(`[ logout ] Logged out successfully`);
                    onUserChange(null);
                })
                .catch((error) => {
                    notify(`[ logout ] Error: ${error.message}`, "error");
                });
        }
    }, [loggedIn]);

    function getUserData(data: any) {
        return new HACUser(
            data.uid,
            JSON.parse(data.savedRecipes) || [],
            data.email,
            data.displayName
        );
    }

    // load the hacUser
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (fbuser) => {
            if (fbuser) {
                const docRef = doc(db, "Users", fbuser.uid);

                // download the contents of the doc now
                getDoc(docRef)
                    .catch((e) => {
                        console.error(
                            `[ getUserData ] ERROR: (${e.code}) - ${e.message}`
                        );
                    })
                    .then((docSnap) => {
                        // if this user has data, return it
                        if (docSnap && docSnap.exists()) {
                            const data = docSnap.data();
                            onUserChange(getUserData(data));
                        }
                        // if the user has no data, generate a blank one
                        else {
                            const newData = new HACUser(
                                fbuser.uid,
                                [],
                                fbuser.email || "",
                                fbuser.displayName || ""
                            );
                            onUserChange(newData);
                            setDoc(docRef, newData.toPlain());
                        }
                    });

                // assign a listener to the user object for changes
                const unsub = onSnapshot(docRef, (docSnap) => {
                    console.log(
                        `[ getUserData ] Loading update from User profile`
                    );
                    const data = docSnap.data();
                    if (data) {
                        onUserChange(getUserData(data));
                    }
                });

                return () => unsub();
            } else {
                onUserChange(null);
            }
        });
    }, []);

    function notify(text: string, status: "error" | "success" = "success") {
        setAlert({ alert: text.split("]")[1].trim(), status: status });
        if (status === "error") {
            console.error(text);
        } else {
            console.log(text);
        }
    }

    function loginWithGoogle() {
        setIsLoadingGoogle(true);
        const auth = getAuth();
        signInWithPopup(auth, googleAUthProvider)
            .then((result) => {
                const user = result.user;
                onClose();
                notify(`[ loginWithGoogle ] Logged in successfully`, "success");
                setIsLoadingGoogle(false);
            })
            .catch((error) => {
                notify(
                    `[ loginWithGoogle ] Failed to sign in with Google`,
                    "error"
                );
                setIsLoadingGoogle(false);
            });
    }

    function loginWithEmail() {
        setIsLoadingEmail(true);

        function admitUser(userCredential: UserCredential) {
            const user = userCredential.user;
            onClose();
            notify(`[ loginWithEmail ] Logged in successfully`, "success");
            setIsLoadingEmail(false);
        }

        const auth = getAuth();
        if (emailLogin) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => admitUser(userCredential))
                .catch((error) => {
                    if (error.code === "auth/wrong-password") {
                        setPasswordError("Incorrect Password");
                    } else if (error.code === "auth/user-not-found") {
                        setEmailError("There is no account with that email.");
                    }
                    // notify(
                    //     `[ loginWithEmail ] Failed to log in ${email}\nError (${error.code}) - ${error.message}`,
                    //     "error"
                    // );
                    setIsLoadingEmail(false);
                });
        } else {
            createUserWithEmailAndPassword(auth, email, email)
                .then((userCredential) => admitUser(userCredential))
                .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                        setEmailError("That email address is already in use");
                    }
                    // notify(
                    //     `[ loginWithEmail ] Failed to create account: ${email}\nError (${error.code}) - ${error.message}`,
                    //     "error"
                    // );
                    setIsLoadingEmail(false);
                });
        }
    }

    function sendResetEmail() {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                notify(
                    `[ sendResetEmail ] Password reset email sent to: ${email}`
                );
            })
            .catch((error) => {
                notify(
                    `[ sendResetEmail ] Failed to send password reset email to: ${email}`,
                    "error"
                );
            });
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
            <Dialog open={open} onClose={() => onClose()}>
                <DialogContent style={{ padding: "20px", width: "300px" }}>
                    <Typography variant="h3" gutterBottom>
                        Login
                    </Typography>
                    <Grid container spacing={2} style={{ marginTop: "10px" }}>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                onClick={() => loginWithGoogle()}
                                variant="contained"
                                style={{
                                    backgroundColor: "#1678f7",
                                    color: "white",
                                    textTransform: "none",
                                    padding: "10px",
                                    fontSize: "11pt",
                                }}
                            >
                                {isLoadingGoogle ? (
                                    <CircularProgress
                                        style={{
                                            color: "white",
                                            height: "17px",
                                            width: "17px",
                                            marginRight: "11px",
                                        }}
                                    />
                                ) : (
                                    <span
                                        style={{
                                            height: "20px",
                                            width: "20px",
                                            background: `url(${googleIcon})`,
                                            backgroundSize: "cover",
                                            margin: "2px 10px 0 0",
                                        }}
                                    />
                                )}
                                Sign in with Google
                            </Button>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            style={{ margin: "20px 0 -10px 0" }}
                        >
                            <Grid item xs={4}>
                                <Divider style={{ width: "100px" }} />
                            </Grid>
                            <Grid item xs={4}>
                                <p
                                    style={{
                                        marginTop: "-10px",
                                        textAlign: "center",
                                    }}
                                >
                                    or
                                </p>
                            </Grid>
                            <Grid item xs={4}>
                                <Divider style={{ width: "100px" }} />
                            </Grid>
                        </Grid>
                        {!emailLogin && (
                            <Grid item xs={12}>
                                <Typography variant="h6">Sign Up</Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                color="secondary"
                                style={{ margin: "10px 0" }}
                                label="Email"
                                value={email}
                                required
                                fullWidth
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError("");
                                }}
                                error={emailError !== ""}
                                helperText={emailError}
                            />
                            <TextField
                                color="secondary"
                                style={{ margin: "10px 0" }}
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                fullWidth
                                required
                                error={passwordError !== ""}
                                helperText={passwordError}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid
                                container
                                justifyContent="space-between"
                                style={{
                                    fontSize: "9pt",
                                    color: "#222",
                                }}
                            >
                                <Grid item>
                                    <span
                                        onClick={() => {
                                            setEmailLogin(!emailLogin);
                                            setPasswordError("");
                                            setEmailError("");
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {emailLogin
                                            ? "Don't have an account yet?"
                                            : "Already have an account?"}
                                    </span>
                                </Grid>
                                <Grid item>
                                    <span
                                        onClick={() => sendResetEmail()}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {emailLogin
                                            ? "Forgot your password?"
                                            : ""}
                                    </span>
                                </Grid>
                            </Grid>

                            <Tooltip
                                title={
                                    !email || !password
                                        ? "You need an Email and Password first"
                                        : ""
                                }
                                placement="top"
                            >
                                <div style={{ marginTop: "40px" }}>
                                    <Button
                                        onClick={() => loginWithEmail()}
                                        fullWidth
                                        disabled={
                                            !email ||
                                            !password ||
                                            isLoadingEmail
                                        }
                                    >
                                        {isLoadingEmail && (
                                            <CircularProgress
                                                style={{
                                                    height: "17px",
                                                    width: "17px",
                                                    marginRight: "11px",
                                                }}
                                                color="secondary"
                                            />
                                        )}
                                        {emailLogin ? "Login" : "Sign Up"}
                                    </Button>
                                </div>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
