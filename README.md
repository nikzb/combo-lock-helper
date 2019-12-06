# Combo Lock Helper

## Need some help getting your combination lock open? Just put in your combination and combo lock helper will show you exactly what to do.

This was created using the following:

* React
* Rebass
* XState
* HTML5 Canvas 
* Create React App

I built the original version of this a few years back using good old HTML, CSS, JS and HTML5 Canvas, using JQuery to manipulate what buttons were showing / enabled or disabled. In the midst of creating that original version, I realized it would be helpful to draw out a finite state machine that showed all the states the app could be in and what transitions could occur to move between those state. 

Fast forward several years, I was checking out XStaet and I decided to rewrite some major parts of this app using the latest tools (React w/ hooks, Rebass, and most of all, XState, because of the fact that I had planned this app out using a finite state machine years earlier). I honestly had never even heard of Rebass, but decided to just give it a try on a whim and my first impression of it is fairly positive. I think I have pretty much bought into the philosophy that combining HTML, CSS, and JS all in one place actually works really nicely in many ways. I am sure there are tradeoffs but based on my experience, I am a fan. 

One last thing: I updated some of the lock animation code, and the basic structure of this updated version is that you call a function `lock` to create a lock animation for the passed in canvas, and you get back an object with several "public" functions you can call. The global variables in the `lock` function are essentially private data, and are accessed by the functions within the `lock` function via closures. 

# Creat React App Info

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
