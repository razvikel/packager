import { Button, TextField, withStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import packages from "all-the-package-names";
import { identity } from "ramda";
import React from "react";
import styles from "./App.styles";
import { MoveToInbox } from "@material-ui/icons";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
      currPackage: "",
    };
  }

  downloadBundle = (currPackage) => {
    window.open(`http://localhost:8080/bundle/${currPackage}`);
  };

  render() {
    const { currPackage, searchTerm } = this.state;
    const { classes } = this.props;
    const displayedPackages = packages
      .filter((name) => name.includes(searchTerm))
      .sort((a, b) => (a === searchTerm ? -1 : b === searchTerm ? 1 : 0))
      .slice(0, 1000);

    return (
      <div className={classes.app}>
        <header className={classes.appHeader}>
          <MoveToInbox
            color="primary"
            style={{ fontSize: "1000%" }}
          ></MoveToInbox>
          <p className={classes.welcomeText}>
            Welcome To Our NPM Package Bundle Generator :)
          </p>
          <div className={classes.searchArea}>
            <Autocomplete
              options={displayedPackages}
              getOptionLabel={identity}
              onChange={(event, currPackage) => this.setState({ currPackage })}
              className={classes.autoComplete}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Insert npm package"
                  variant="outlined"
                  onChange={(event) => {
                    this.setState({ searchTerm: event.target.value });
                  }}
                />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (currPackage) {
                  this.downloadBundle(currPackage);
                }
              }}
            >
              Go!
            </Button>
          </div>
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(App);
