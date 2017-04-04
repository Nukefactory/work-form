# Work form
Basic work request form for use by graphic design department.

## Contents
Single page form with basic file upload function. Sends content via PHP mail.

## Installation

### Requirements
- NodeJS
- Bower
- Git *(Optional)*

### Steps
1. Install [NodeJS](https://nodejs.org/)
2. Install [Bower](https://bower.io/)
3. Clone/checkout https://github.com/Nukefactory/work-form.git or download the [.zip](https://github.com/Nukefactory/work-form/archive/master.zip)
4. Install dependencies:
    - Run '$ npm install' from working directory
    - Run '$ bower install' from working directory
5. Run gulp to build: '$ gulp'

## Edits
Subfolders are labelled in 'src'. HTML pages are built using [pug](https://pugjs.org) but can be substituted with standard HTML if preferred (standard HTML will still copy to dist on build).

## Gotchas
'dist' folder will build and run browsersync for local building, but must be uploaded/run from server with PHP available in order to receive completed form contents. Think LAMP/MAMP et al if you don't have a server handy.

## Have at it
Feel free to hack and build upon as needed. Pull requests for improvements welcomed. Hope it can be of some use.