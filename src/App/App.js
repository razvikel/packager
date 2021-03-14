import { Button, TextField, withStyles } from "@material-ui/core";
import { MoveToInbox } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import packages from "all-the-package-names";
import axios from "axios";
import { prop } from "ramda";
import React from "react";
import styles from "./App.styles";
import { nameSorter } from "./App.utils";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
      currPackage: "",
      images: [],
    };
    this.imagesLimit = 10;
    // this.serverUrl = "http://localhost:8080";
    this.serverUrl = "https://packager-backend.herokuapp.com";
  }

  searchImages = async (searchTerm, limit) => {
    const { data: images } = await axios.get(
      `${this.serverUrl}/docker/images?term=${searchTerm}&limit=${limit}`
    );
    return images;
  };

  downloadBundle = ({ name, type }) => {
    if (type === "npm") {
      window.open(`${this.serverUrl}/bundle/${name}`);
    } else if (type === "docker") {
      window.open(`${this.serverUrl}/docker/${name}`);
    }
  };

  render() {
    const { currPackage, searchTerm, images } = this.state;
    const { classes } = this.props;
    const { searchImages, imagesLimit } = this;
    const displayedPackages = packages
      .map((name) => ({ name, type: "npm" }))
      .filter(({ name }) => name.includes(searchTerm))
      .sort(nameSorter(searchTerm))
      .slice(0, 10);

    const displayedImages = images
      .map((name) => ({ name, type: "docker" }))
      .sort(nameSorter(searchTerm));

    const displayedNames = [...displayedPackages, ...displayedImages];

    return (
      <div className={classes.app}>
        <header className={classes.appHeader}>
          <MoveToInbox color="primary" className={classes.icon}></MoveToInbox>
          <p className={classes.welcomeText}>
            Welcome To Our Package Bundle And Docker Image Generator :)
          </p>
          <div className={classes.searchArea}>
            <Autocomplete
              groupBy={prop("type")}
              options={displayedNames}
              getOptionLabel={prop("name")}
              onChange={(event, currPackage) => this.setState({ currPackage })}
              className={classes.autoComplete}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Insert package or image name"
                  variant="outlined"
                  onChange={async (event) => {
                    const images = await searchImages(
                      event.target.value,
                      imagesLimit
                    );
                    this.setState({ searchTerm: event.target.value, images });
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
