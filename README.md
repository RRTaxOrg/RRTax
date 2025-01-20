This is the RRtax Website Project for EECS2311Z

**Tech Stack**
- Next.js - Frontend
- Java server - Backend
- SQLite - Database

**Todo**
- Tech stack
- Main features
- Main site layout
- UI/UX design for pages
- Color theme

**Information Needed**
- Logo
- Motto
- About Us info

## Getting Started With The Project
## Go and install Node.js from the internet

## 1> First make you own copy of the project by making a fork witch is like making a copy of the project on github. it can be done from the github repo
- Fork the repo then open it in your IDE VS code is recommended

## 2> Then open the project in your IDE open the terminal and to run the project do the following
- First, Install all the dependencies you need for the project, this makes sure your packages are upto date ONLY DO THIS ONCE PER FORK:
- first go into your project folder in the terminal then use this to install
```bash
npm install
```

## 3> Next to run the project meaning to host the current website on your local machine do the following
- after this the website will run on localhost at port 3000 'https://localhost:3000'
- NOTE THIS IS JUST A DEVELOPMENT VERSION
```bash
npm run dev
```

## 4> To build the project for production use the following command
- this will make the website ready for deployment and the whole website will be compressed into the .next folder
```bash
npm run build
```

## 5> To Run THis Production Version of the website use the following command
- this will make the website run on localhost at port 3000 'https://localhost:300 but this will run the final production version
```bash
npm start
```

**You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.**

## Project Structure
```
MOOD-ATLAS/
│
├── .next/                            # Next.js build and runtime files (this folder is the final build) only made once you npm run build
├── app/                              # main application code with all the individual files (pages) including the layout
│   ├── global.css              # contains all the css styles used throughout the app
│   ├── layout.js                # defines the layout of the app i.e the header main page etc 
│   └── page.js                   # the main page of the app
├── pages/api                      # main application api endpoints (basically the server files that make api requests for us so we dont have too do it in the frondend app folder, avoids CORS issues)
├── public/                          # contains all the static assets like images etc                
├── utils/                             # contains utility functions used throughout the app like global colors etc used throughout the app and are the same everywhere
├── .gitignore                     # tells git which files to ignore put the names of files or folders here so that they dont get pushed to the repo
├── babel.config.js             # babel config for website setting (ignore this for now)
├── jsconfig.json                # contains the configuration for the js files in the project (ignore this)
├── next.config.mjs           # contains the configuration for the next.js app like trusted api domains etc (Use this carefully)
├── package-lock.json       # contains the dependencies and scripts for the project the lock file is used to ensure that the same versions of the packages are used in the project
├── package.json               # contains the dependencies and scripts for the project 
├── postcss.config.mjs      # postcss config for the app (Ignore this for now)
└── tailwind.config.mjs    # contains the configuration for tailwind css (adds a lot of stuff to CSS like hover effects etc)
```