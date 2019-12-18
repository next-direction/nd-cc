# Next Direction Coder Community

This is the repository of coder community. A project I created to practice a lot of stuff I learned over the last two years.

## Why?

The reason why I created this project was the lack of a good place to make a community related to programming projects. I took a lot of online courses to learn new languages, techniques and frameworks. In these courses a lot of instructors created communities based on Discord.

In my opinion, this is not really suited for big communities related to coding topics or projects where programming is the main part. Why I think this? 

First of all it gets really confusing after some time. You have either a lot of different channels or a single channel is used for lots of different questions. In addition you don't have an easy way to refer to another post/question/answer.

Second of all they don't have a real code editor. Therefore it is really hard to read questions/answers, especially if code is not formatted or highlighted.

## What?

First things I want to build are:
* Login/Registration
* Legal stuff that comes with communities like privacy notice, terms of use and imprint
* Category overview
* Questions/Answers including votes and accepting main answer
* Comments for questions and answers
* Search for questions

## How?

The backend is powered by [Directus](https://directus.io/). Very little development is needed on this part (which was my goal from the beginning). Mostly hooks are required for certain tasks like default roles for new users or sanitizing user input.

The frontend will be powered by [Nuxt.js](https://nuxtjs.org/). The goal here is to use as little dependencies as possible.

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
