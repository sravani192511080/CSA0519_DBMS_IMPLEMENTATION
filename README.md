# Blood Bank Management - GitHub Pages demo

This repository includes a static browser-based demo so it can be opened with GitHub Pages. The pages hosted by GitHub Pages do not execute the PHP files or connect to MySQL; `index.html`, `app.js`, and `style.css` provide the hosted demo.

## Publish the site

1. Add and commit `index.html`, `app.js`, `style.css`, and this README to the root of the `CSAO519_IMPLEMENTATION` repository.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.
4. Wait for the Pages deployment to finish. The site should then be available at `https://sravani192511080.github.io/CSAO519_IMPLEMENTATION/`.

## Demo data

Donor, inventory, request, and issue actions are saved in the current visitor's browser using local storage. Each visitor starts with sample records; changes made by one visitor are not shared with other visitors and are not saved to the PHP/MySQL database. Use **Reset demo data** to restore the original sample records in that browser.

For shared data and real database-backed use, deploy the PHP application to a host that supports PHP and MySQL instead of GitHub Pages.
