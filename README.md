# Ouijably - realtime messaging from beyond the grave 👻
## *Press enter if you dare!*

In the spirit (👻) of the Halloween season and keeping things spooky, I've built a digital, online version of the original spiritualists' tool to help you communicate with the dead ⚰️ (or maybe just the ghosts in the machine).

> The ouija (/ˈwiːdʒə/ WEE-jə, /-dʒi/ jee), also known as a spirit board or talking board, is a flat board marked with the letters of the alphabet, the numbers 0–9, the words "yes", "no", occasionally "hello" and "goodbye", along with various symbols and graphics. 
>
> It uses a planchette (small heart-shaped piece of wood or plastic) as a movable indicator to spell out messages during a séance. 
>
> Participants place their fingers on the planchette, and it is moved about the board to spell out words.
>
> Spiritualists believed that the dead were able to contact the living and reportedly used a talking board very similar to a modern Ouija board at their camps in Ohio in 1886 to ostensibly enable faster communication with spirits.
>
> Following its commercial introduction by businessman Elijah Bond on July 1, 1890, the Ouija board was regarded as an innocent parlor game unrelated to the occult until American spiritualist Pearl Curran popularized its use as a divining tool during World War I.
>
><cite>Wikipedia</cite>

## How to use the Ouijably board

1. Create a new board by inputting a name.
2. Share the link to the board with your f(r)iends.
3. Ask the board a question.
4. Watch as the answers are revealed.

<img src="https://cdn.glitch.com/c94f1ebe-bd96-4fd9-89b5-f34ea3b02caf%2Ftw-og.png?v=1602841541892" alt="the Ouijably spirit board">

## How does a spirit board work?

The spirit board takes advantage of the ["ideomotor phenomenon"](https://en.wikipedia.org/wiki/Ideomotor_phenomenon) -  the process whereby a thought or mental image brings about a seemingly "reflexive" or automatic muscular reaction, often of minuscule degree, and potentially outside of the awareness of the subject.

The idea is that by posing questions to the board, participants reflexively and subconsciously (or perhaps at the behest of a spirit!) move the planchette around to spell out the answers to the questions being posed.

Thinking about how spirit boards work using the ideomotor phenomenon poses the question:

    If the spirit board can make users involuntarily move their hands across a physical planchette,can we reproduce this effect with computer mice and gyroscopes?

In principle, the effect should work in exactly the same way, with the users’ natural desire to "push" the planchette replaced by their ability to control the digital recreation of one.

So why not build it?! Curiosity never got anyone in trouble before, I'm sure...

# Contents

  * [What's in this repo?](#whats-in-this-repo)
    + [What do I need to run the web app?](#what-do-i-need-to-run-the-web-app)
      - [What is Ably and why do I need it for this project?](#what-is-ably-and-why-do-i-need-it-for-this-project)
      - [Ably channels and API keys](#ably-channels-and-api-keys)
    + [Local dev pre-requirements](#local-dev-pre-requirements)
    + [How authentication with Ably works](#how-authentication-with-ably-works)
    + [The Azure function](#the-azure-function)
  * [The application](#the-application)
    + [Joining the board](#joining-the-board)
    + [Displaying the board](#displaying-the-board)
    + [index.ts](#indexts)
    + [JoinBox.ts](#joinboxts)
    + [SpiritBoard.ts](#spiritboardts)
    + [Rendering the board](#rendering-the-board)
    + [Watching user input with events and gyros](#watching-user-input-with-events-and-gyros)
    + [Moving the planchette](#moving-the-planchette)
    + [Detecting letters/numbers](#detecting-lettersnumbers)
    + [Notifying the users of letter detection](#notifying-the-users-of-letter-detection)
    + [Resolution scaling](#resolution-scaling)
    + [Making the layout responsive](#making-the-layout-responsive)
  * [Technical Notes - Snowpack](#technical-notes---snowpack)
  * [Does it work?](#does-it-work)

## What's in this repo?

The repo is a fully functioning spirit board web application. In this README, we'll cover how it works and how to run it both locally and in a production environment.

### What do I need to run the web app?

- An [Ably account](https://www.ably.io/signup) and [API key](https://support.ably.com/support/solutions/articles/3000030502-setting-up-and-managing-api-keys)
- A [Microsoft Azure Account](azure.microsoft.com/account/sign_up) for hosting on production
- [azure-functions-core-tools](https://github.com/Azure/azure-functions-core-tools)
- [Node 12](https://nodejs.org/en/download/) (LTS)
- [TypeScript](https://www.typescriptlang.org/) + [Snowpack](https://www.snowpack.dev/) (these dependencies will install from the package.json, you do not have to install them yourself)

#### What is Ably and why do I need it for this project?

The web app uses [Ably](https://www.ably.io/) for [pub/sub messaging](https://www.ably.io/documentation/core-features/pubsub) between users. Ably is an enterprise-ready pub/sub messaging platform that makes it easy to design, ship, and scale critical realtime functionality directly to your end-users. In this case, we're using Ably to send messages between users when they move their mouse.

#### Ably channels and API keys

In order to run this app, you will need an Ably API key. If you are not already signed up, you can [sign up now for a free Ably account](https://www.ably.io/signup). Once you have an Ably account:

1. Log into your app dashboard.
2. Under **“Your apps”**, click on **“Manage app”** for any app you wish to use for this tutorial, or create a new one with the **“Create New App”** button.
3. Click on the **“API Keys”** tab.
4. Copy the secret **“API Key”** value from your Root key. We will use it later when we build our app.

This app is going to use [Ably Channels](https://www.ably.io/channels) and [Token Authentication](https://www.ably.io/documentation/rest/authentication/#token-authentication).

### Local dev pre-requirements

We'll use Azure functions to host our API, so you'll need to install the Azure functions core tools. Run:

```bash
npm install -g azure-functions-core-tools
```

You'll also need to set your API key for local dev:

```bash
cd api
func settings add ABLY_API_KEY Your-Ably-Api-Key
```

Running this command will encrypt your API key into a `/api/local.settings.json` file.
You don't need to check it in to source control, and even if you do, it won't be usable on another machine.

### How authentication with Ably works

Azure static web apps don't run traditional "server side code", but if you include a directory with some Azure functions in your application, the Azure deployment engine will automatically create and manage Azure functions for you to call from your static application.

For local development, we'll use the Azure functions SDK to replicate this. For production, we can use static files (or files created by a static site generator of your choice) and Azure will serve them for us.

### The Azure function

We have a folder called [API](/api), which contains an Azure functions JavaScript API. In the folder, there are a bunch of files which are created by default (package.json, host.json etc.) by the functions SDK. You don't need to touch these. If you wanted to expand the API, you would use `npm install` and the package.json file to manage dependencies for any additional functions.

There's a directory [api/createTokenRequest](/api/createTokenRequest) - this is where all of our "server side" code lives. Inside it, there are two files - [index.js](/api/createTokenRequest/index.js) and [function.json](/api/createTokenRequest/function.json). The `function.json` file is the Functions' binding code that the Azure portal uses for configuration. It is generated by the SDK and you don't need to change it.

Our Ably code is inside the `index.js` file:

```js
const Ably = require('ably/promises');

module.exports = async function (context, req) {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'ably-spiritboard' });
    context.res = { 
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tokenRequestData)
    };
};
```

This configures the API to be available on `https://<azure-url>/api/createTokenRequest` by default. We're going to provide this URL to the Ably SDK in our client to authenticate with Ably.

## The application

We're going to build this application as a client side web app with HTML, CSS and TypeScript. We'll use Ably realtime messaging to power communication between users. We'll use Snowpack as our dev server and build tool, which lets us write TypeScript that is transparently compiled to JavaScript for our browsers.

We need our web app to do two things:

1. Let users create and name a board they can join together with their friends
2. Render our spirit board and planchette


To achieve this, we need two distinct interfaces: a form to name and join a board, and the board itself.

Our entire UI will fit inside our index.html file, so let's start by looking at the form in [index.html](/app/index.html).

### Joining the board

This is a regular HTML form:
```html
<section id="join" class="join hidden">
    <h1>Join a Seance</h1>
    <form id="joinForm" class="join-form">
        <label for="boardName">Enter a board name: </label>
        <input id="boardName" name="boardName" type="text" />
        <button id="joinBtn" class="join-button" type="submit">Join board</button>
    </form>
```

Clicking the button will redirect the user right back to `index.html` with the `boardName` field value added as a query string parameter. We can then process this in our `index.ts` file.

### Displaying the board

Our board is represented by a `div`, which contains an `SVG`, and two additional placeholder `divs`: one for our `planchette`, and another acting as a placeholder for playing animations when a letter or number is 'revealed'.

```html
<div id="activeBoard" class="hidden board-holder">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 1240 768" xml:space="preserve">
        <polygon data-focus="150.1,319.4" data-item="a" class="holder"
            points="105.2,288.1 159.4,276.5 195,340.6 111.2,362" />

            ... (many more polygons)

        <polygon data-focus="992,653.1" data-item="no" class="holder"
            points="949,631 951.2,675.3 1030.1,675.8 1034.9,653.1 1024.9,629.2" />
    </svg>

    <div class="planchette" id="planchette"></div>
    <div class="animation" id="animation"></div>
</div>
```

We'll go into more detail on what the `polygons` are for when we discuss hit detection, but we have one for each 'revealable' element in our spirit board.

Displaying the board itself is relatively simple. For this purpose, we use a background image on `.board-holder`. Once a session has been joined, we remove the `hidden` class on the `#activeBoard` and add it to the `#joinForm`.

### index.ts

[index.ts](/app/index.ts) is our app’s entry point and contains all the logic to connect to a board and display the right things. It looks like this:

```js
import { SpiritBoard } from "./js/SpiritBoard";
import { JoinBox } from "./js/JoinBox";
import { Networking } from "./js/Networking";
```

As demonstrated above, first, we import all the libraries we need - we've split out a lot of the logic for different parts of the app into their own files - SpiritBoard, JoinBox, and Networking.

Then, we create instances of the three components. 

```js
(async function () {

const networking = new Networking();
const joinBox = new JoinBox("join");
const board = new SpiritBoard("activeBoard", networking);
```

Notice that we pass the id of the `join` and `activeBoard` elements to the constructors of their respective objects. These objects will perform any DOM manipulation that we need to do.

We also provide an instance of the `Networking` class to the `SpiritBoard` constructor, because the board will use this class to send messages via Ably.

```js
  const boardName = new URLSearchParams(location.search).get('boardName');

  if (!boardName) {
    joinBox.setBoardName("spoopy-kids");
    joinBox.show();
    return;
  }
```

Now, we need to check if a `boardName` appears in the query string of our request. If it does, we know that a user has posted the `join` form, and wants to join a board by that name. If we don't find this `boardName` in the query string, we presume we need to display the join box.

Because all of the UI elements are hidden by default, we call the `show` function on our `JoinBox` instance, which will remove the `hide` class.

If we get past this guard clause, we can presume that we know the board we need to be joining, and we want to connect to an Ably channel using the `boardName`.

```js
  networking.on("join", () => {
    board.planchette.centre();
  });
```

First, we wire up some callbacks - when new users join the board, we want to centre the planchette to make sure that everyone stays in sync. If we don't do this, the planchette could appear at different locations on each user's screen.

```js
  networking.on("nudge", (message) => {
    board.movePlanchette({ deltaX: message.data.deltaX, deltaY: message.data.deltaY });
  });
```

Next, we wire up the callback to respond to messages being received from other clients. We call `board.movePlanchette()` with the contents of our message. Notice that each of these messages has a different name - the `Networking` class is handling our Ably subscriptions for us here.

Then we await a connection to the channel. After this point, we're connected, and we know we'll be kept in sync with all the other users by processing the same messages they receive:

```js
  await networking.connect(boardName);
```

Now, we need to wire up some of the effects. When the planchette lands on a letter in the browser, we want to 'reveal' it by playing a spooky animation that we'll implement in the SpiritBoard class and animate in the CSS.


```js
  board.onReveal((item) => {
    board.spookyAnimate(item.text);
  });
```

And finally, we display the spirit board, and play some spooky music, along with registering the service worker which will display a page if the app is offline.

```js
  board.show();

  const audio = new Audio("/audio/dangerousound.ogg");
  audio.volume = 0.03;
  audio.play();


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

})();
```

This index file explains everything that the game does - but not how it does it, so let's dig deeper into some of our classes.

### JoinBox.ts

[JoinBox.ts](/app/joinbox.ts) captures our UI interactions with the Join form and it looks like this:

```ts
export class JoinBox {

    private _root: HTMLElement;
    private _boardNameInput: HTMLInputElement;

    constructor(element: string | HTMLElement) {
        this._root = typeof element === "string" ? this._root = document.getElementById(element) : element;
        this._boardNameInput = <HTMLInputElement>this._root.ownerDocument.getElementById("boardName");
    }

    hide() {
        this._root.classList.add("hidden");
    }

    show() {
        this._root.classList.remove("hidden");
    }

    setBoardName(boardName: string) {
        this._boardNameInput.value = boardName;
    }
}
```

Most of the work is done in the constructor, which finds the element in the page (or uses one provided by our tests) and finds the input box that users fill out their desired board name in.

There are a couple of functions that we call from our index - `hide`, `show`, and `setBoardName`. All three of them are pretty self-explanatory and do exactly what their names suggest:`hide` and `show` use CSS classes, and `setBoardName` fills the textbox with whatever parameter is passed to the function.

If you're new to `TypeScript`, you might be wondering what the `:HTMLElement` and `: HTMLInputElement` syntax after our variable declarations is. These are TypeScript type annotations. By using them, you get better auto-complete support and compile-time checking when our application gets built.

### SpiritBoard.ts

In [SpiritbBoard.ts](/app/SpiritBoard.ts), the SpiritBoard class contains all of the interactions we can have with our board. Each one is an exposed `public function`.

```ts
    public show() { ... }
    public movePlanchette() { ... }
    public onReveal() { ... }
    public spookyAnimate() { ... }
```

Notice that these are the functions called by our `index.ts` file when it starts the app up.

The `SpiritBoard` is also responsible for listening to mouse movement and gyroscope events, which subsequently send messages via Ably to move the `Planchette`.

We're now going to walk through the code and unpick what the SpiritBoard does.

First, we import the dependencies and create a `Type definition` for our `RevealedItemCallback`:

```ts
import { Networking } from "./Networking";
import { Planchette } from "./Planchette";
import { Delta, DetectedItem } from "./types";

export type RevealedItemCallback = (item: DetectedItem) => void;
declare const Gyroscope: any;
```

We also declare a constant called `Gyroscope` to represent the browser's `Gyroscope` APIs. (These are new and not quite finalised, so don't exist in the currently published Type definitions.)

Next, we declare a `SpiritBoard` class:

```ts
export class SpiritBoard {

    public planchette: Planchette;
    public blockMovement: boolean;

    private _root: HTMLElement;
    private _animationElement: HTMLElement;

    private _networking: Networking;
    private _visible: boolean;
    private _lastItem: DetectedItem;

    private _revealedItemCallback: RevealedItemCallback;
    private _blockedMovementBuffer: Delta[];
```

Up next, it’s time to create some public variables - one for the `planchette`, and another called `blockMovement`. Once that is done, we declare some private variables to keep track of the board state. 

Finally, we define the constructor:

```ts
    constructor(element: string | HTMLElement, networking: Networking) {

        this._root = typeof element === "string"
            ? this._root = document.getElementById(element)
            : element;

        this._networking = networking;

        const planchetteElement = this._root.ownerDocument.getElementById("planchette");
        this._animationElement = this._root.ownerDocument.getElementById("animation");

        this.planchette = new Planchette({ x: 0, y: 0 }, planchetteElement);
        this._blockedMovementBuffer = [];

        this._root.addEventListener("mousemove", (ev: MouseEvent) => { this.monitorMouse(ev); });
        this.enableGyroscope();
    }
```

The constructor finds the `planchette` and `animation` elements in the HTML (so that it can manipulate them later), stores a copy of the `Networking` instance, and at the end wires up `Event Listeners` to the `mousemove` event and/or calls a function that connects to the `Gyroscope` if we're running on a device that has one.

### Rendering the board

Similar to `JoinBox`, displaying the spirit board is achieved by removing a `hidden` CSS class. In addition, we also have to trigger the drawing of the `Planchette`.

```ts
public show() {
    this._root.classList.remove("hidden");
    this._visible = true;
    this.planchette.centre();
    this.render();
}
```

The `show` function itself removes the class, centres the planchette, and calls a private `render()` function.

```ts
private render() {
    this.planchette.render();
    this.raiseEventsForNewlyRevealedItems();

    if (this._visible) {
        window.requestAnimationFrame(() => this.render());
    }
}
```

This `render()` function calls `render` on the `Planchette`, and invokes `raiseEventsForNewlyRevealedItems` (which we'll discuss in a later section). Then, using the `requestAnimationFrame()` API, it queues a callback to itself. [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) is a browser API for animating page elements - and your browser will call this function many times a second to match the frame rate of your browser, a frame rate that normally matches the refresh rate of your computer's display.

This means we're going to be constantly running the `render()` function once we've called `show()`, and while the board is visible.

### Watching user input with events and gyros

The [SpiritBoard](/app/SpiritBoard.ts) handles all of the user input. First, the constructor wires up mouse movement events and calls our `enableGyroscope` function:

```ts
constructor(element: string | HTMLElement, networking: Networking) {
    ...
    this._root.addEventListener("mousemove", (ev: MouseEvent) => { this.monitorMouse(ev); });
    this.enableGyroscope();
}
```

`monitorMouse` then uses the `Networking` instance to `sendBufferedMessage()` with the movement information from the mouse movement event:

```ts
private monitorMouse(event: MouseEvent) {
    this._networking.sendBufferedMessage("nudge", { deltaX: event.movementX, deltaY: event.movementY });
}
```

We can use `enableGyroscope`, if a gyroscope is available, to add an event listener to `reading`, at a frequency of 60 times per second:

```ts
private enableGyroscope() {
    if (typeof Gyroscope !== "function") {
        return;
    }

    let gyroscope = new Gyroscope({ frequency: 60 });
    gyroscope.addEventListener('reading', (e: any) => {
        const effectiveX = (gyroscope.x) * 10;
        const effectiveY = (gyroscope.y * -1) * 10;
        this._networking.sendBufferedMessage("nudge", { deltaX: effectiveX, deltaY: effectiveY });
    });
    gyroscope.start();
}
```

**NB**: Notice the magic number `10` in there - this is because gyroscopic movements are a lot smaller than mouse movements, so we're multiplying the value up to make the values raised from these events a little more similar. You can change this as preferred.

Any time a user moves their mouse, a `MouseEvent` is raised and a message is sent. If they're using a device that supports gyroscopes, **sixty messages a second** will be sent for all the gyroscopic movements. That's a lot of messages, at a really high frequency, and we'd probably burn through our Ably message limits if this was all we did here.

So we're going to do some message buffering!

The `Networking` class exposes a function called `sendBufferedMessage` that we can call. Here is an extract from the class with only the functions related to sending messages:

```ts
export class Networking {

    private _ably: Types.RealtimePromise;
    private _channel: Types.RealtimeChannelPromise;
    private _handlers: Map<string, MessageHandler>;

    private _outboundBuffer: any[];
    private _bufferCap: number = 150;

    constructor(ablyClient: Types.RealtimePromise = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' })) {
        this._ably = ablyClient;
        this._handlers = new Map<string, MessageHandler>();

        this._outboundBuffer = [];
        setInterval(() => { this.flushBuffer(); }, 1000);
    }

    ...

    public sendBufferedMessage(type: string, data: any): void {
        this._outboundBuffer.push({ name: type, data: data });

        if (this._outboundBuffer.length >= this._bufferCap) {
            this.flushBuffer();
        }
    }

    private flushBuffer() {
        if (this._outboundBuffer.length > 0) {
            this._channel.publish({ name: "bulk", data: this._outboundBuffer });
            this._outboundBuffer = [];
        }
    }
}
```

Whenever we use `sendBufferedMessage`, it actually puts the message into a variable called `_outboundBuffer`. If, during the sending of a message, our buffer reaches our `_bufferCap` (set to 150 messages), it'll flush the buffer. Flushing the buffer simply takes the collection of messages, and sends them all at once via Ably in a single message with the name `bulk`.

Elsewhere in this class, if a `bulk` message is received, each of these array elements is looped over, and our message handlers are called for each individual item:

```ts
await this._channel.subscribe((message: Ably.Types.Message) => {

    const messagesToProcess = message.name == "bulk" ? [...message.data] : [message];

    for (let msg of messagesToProcess) {
        const handler = this._handlers[msg.name];
        handler?.(msg);
    }
});
```

Finally, to be safe, there's a timer that we set up in the constructor. Every second, the buffer will attempt to flush itself, so if any messages are left unsent in the buffer, they'll be swept up by this flush task.

Buffering the messages like this means that we have more control over how the clients send messages, preventing huge spikes in our Ably traffic from a user wildly swinging their mouse or device around.

### Moving the planchette

The `SpiritBoard.ts` file exposes a function called `movePlanchette`:

```ts
public movePlanchette(movement: Delta) {
    if (this.blockMovement) {
        this._blockedMovementBuffer.push(movement);
        return;
    }

    this.planchette.move(movement);
}
```

This function is hooked up to our Ably messages in `index.ts`. As you can see above, it's not where the logic to actually *move* our planchette resides.

`Deltas`, which move the planchette, look like this:

```ts
export type Delta = { deltaX: number; deltaY: number; }
```

`Deltas` are made up of two numbers - a deltaX and a deltaY are passed onto the `planchette.move()` function.

```ts
export class Planchette {

    public location: Coordinate;
    ...

    public move(delta: Delta): void {
        this.location.x += delta.deltaX;
        this.location.y += delta.deltaY;
        this.snapToBoundaries();
    }
}
```

`.move()` is used to modify the current x and y locations of the top left of the planchette (stored as a `Coordinate`):

```ts
export type Coordinate = { x: number; y: number; }
```

Then, it calls a function called `snapToBoundaries`. This function is responsible for making sure that once we've moved the planchette, it hasn't gone flying way out of the boundaries of the board graphic and into the ether. While spooky, this wouldn't really help anyone to use the board! 👻

`snapToBoundaries` might be a little tedious to read line by line. However, it allows the planchette to only cross the boundaries of the board by half of its own width or height. We do this to make sure that the planchette can still discover any letters towards the bottom, or far left and right of the board:

```ts
private snapToBoundaries() {
    const boundaries = {
        top: 0,
        left: 0 - this.halfWidth,
        bottom: this.parentBoardHeight + this.halfHeight,
        right: this.parentBoardWidth + this.halfWidth
    };

    const snapPoints = {
        top: 0,
        left: 0 - this.halfWidth,
        bottom: this.parentBoardHeight - this.halfHeight,
        right: this.parentBoardWidth - this.halfWidth
    };

    this.location.x = this.location.x <= boundaries.left ? snapPoints.left : this.location.x;
    this.location.x = this.rightBound <= boundaries.right ? this.location.x : snapPoints.right;
    this.location.y = this.location.y < boundaries.top ? snapPoints.top : this.location.y;
    this.location.y = this.bottomBound <= boundaries.bottom ? this.location.y : snapPoints.bottom;
}
```

We start by setting up some boundaries. nce we've modified the location of the planchette, if it has moved outside of those boundaries, we set its location to the corresponding `snapPoint` - the furthest location the `planchette` should be allowed to go outside of the border.

You might notice we've not actually drawn the `planchette` in any of this code, we've just updated its location.

That's because our `planchette.render` function is actually called by the recurring calls to `getAnimationFrame` from the `SpiritBoard` class.

```ts
public render() {
    const pixelFloored: Coordinate = {
        x: Math.floor(this.scaledLocation.x),
        y: Math.floor(this.scaledLocation.y)
    };

    this._root.style.transform = `translate(${pixelFloored.x}px, ${pixelFloored.y}px)`;
}
```

Here, we calculate the location to draw the `planchette` on the user's screen, and then apply a CSS transform to the HTML element. In the CSS we have applied `transition: all ease-in-out 1s` to the planchette element, which smooths the transform movement into an eased animation over 1 second, which makes the planchette drift gently across the screen.

If you're eagle-eyed, you might notice we're using a `this.scaledLocation` property to do this - we'll talk about that in more detail later when we discuss `resolution scaling`.

### Detecting letters/numbers

The letter detection is driven by the `SpiritBoard.ts` render function:

```ts
private render() {
    this.planchette.render();
    this.raiseEventsForNewlyRevealedItems(); // <--- Detection is triggered here.

    if (this._visible) {
        window.requestAnimationFrame(() => this.render());
    }
}
```

The `raiseEventsForNewlyRevealedItems()` function defines the behaviour of the spirit board when items are detected:

```ts
private raiseEventsForNewlyRevealedItems() {
    const revealedItem = this.planchette.reveal();
    if (revealedItem == null) {
        return;
    }

    if (revealedItem.text == this._lastItem?.text) {
        return;
    }
```

We call `planchette.reveal()`, and if anything is returned, or if the returned item has changed, we then go on to run this code:

```js
    this._lastItem = revealedItem;
    this.temporarilyBlockMovement(3_000);

    this.planchette.focusOn(revealedItem);

    if (this._revealedItemCallback) {
        this._revealedItemCallback(revealedItem);
    }
}
```

Here, we stop the planchette from responding to user input for three seconds, and we focus on the `focalPoint` of our revealed item by moving the center of the planchette 'viewfinder' to the center of the detected character.If there's a callback (like there is in `index.ts`), we'll call it.

Character detection work happens in the `planchette.reveal()` function:

```ts
public reveal(): DetectedItem | null {
    const itemsAtLocation = [...this.detectElementsAt(this.viewfinderTarget)];

    if (itemsAtLocation.length == 0) {
        return null;
    }

    const first = itemsAtLocation[0];
    const item = first.getAttribute("data-item");

    const focusParts = first.getAttribute("data-focus").split(',');
    const detectionPoint = {
        x: parseInt(focusParts[0]),
        y: parseInt(focusParts[1])
    };

    return { text: item, focalPoint: detectionPoint };
}
```

In this function, we call `detectElementsAt()`, passing in a property called `viewFinderTarget` - this is the location of the center of the planchette's viewfinder. If something is returned, we read two data attributes from the element so that we can move the planchette to pleasingly frame it: the `item` - literally the letter or phrase the planchette is hovering over, and the `focus` - the visual middle point of that character. 

Fortunately, most of the heavy lifting here is actually done by the browser:

```ts
private detectElementsAt(point: Coordinate): Element[] {
    const adjustedForWindowMargin = {
        x: point.x + this.parentBoardMargin,
        y: point.y
    };

    const elementsDetected = [...this._root.ownerDocument.elementsFromPoint(adjustedForWindowMargin.x, adjustedForWindowMargin.y)];
    return elementsDetected.filter(element => element.classList.contains("holder"));
}
```

We start off with a little bit of maths to make sure we have the correct coordinates, and then we call the `DOM` API `elementsFromPoint`.

When we call this on an x,y coordinate, it'll return a list of elements under that literal point in the browser. We then filter out any elements that don't have a class of `holder`. To understand why, we'll need to retake a look at our markup.

The SVG element in the HTML is a series of `polygon` elements which border each character or word on the spirit board. We use this because triggering detection on the letters themselves would cause false negatives (for example when the center of the planchette was in the center of a 0 character, it would not trigger). Creating a `polygon` around each character gives a solid space for the planchette to detect.

```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 1240 768" xml:space="preserve">

    <polygon 
        data-item="a" 
        data-focus="150.1,319.4" 
        class="holder"
        points="105.2,288.1 159.4,276.5 195,340.6 111.2,362" 
    />
    ...
</svg>
```

This example shows a single, expanded `polygon` element so you can clearly see its attributes.

By outlining the characters with these hit detection polygons, we ensure that what the users see through the `planchette` is exactly the letter we're detecting, and that it feels responsive. If this feels familiar to you, it's because it's very similar to the way that hit detection works in HTML image maps. *Editor's note: remember the bad old days of giant images and dozens of image maps?!*

If we rendered the polygons with a black fill, they would look like this:
<img src="https://cdn.glitch.com/c94f1ebe-bd96-4fd9-89b5-f34ea3b02caf%2Fpolygon.png?v=1602841192475" alt="the polygons surrounding the characters on the spirit board">

Let’s review the attributes:
* The `data-item` attribute tells us what character is contained.
* The `data-focus` attribute represents the coordinates of the center of the polygon (eyeballed in Adobe illustrator).
* The `class` is how we're selecting the correct elements to run detection on.
* The `points` describe the path of the edges of the polygon (a less than 6 sided-shape usually).

By adding the data- attributes to the embedded SVG, we can use our browser's features to do high quality hit detection.

Jumping all the way back to `raiseEventsForNewlyRevealedItems`:

```ts
private raiseEventsForNewlyRevealedItems() {
    const revealedItem = this.planchette.reveal();
    if (revealedItem == null) {
        return;
    }

    if (revealedItem.text == this._lastItem?.text) {
        return;
    }

    this._lastItem = revealedItem;
    this.temporarilyBlockMovement(3_000);

    this.planchette.focusOn(revealedItem);

    if (this._revealedItemCallback) {
        this._revealedItemCallback(revealedItem);
    }
}
```

If we detect a new letter, we call any `this._revealedItemCallback` that's been registered.

### Notifying the users of letter detection

When we first looked at [index.ts](/app/index.ts) you might have noticed `onReveal()` being called:

```ts
board.onReveal((item) => {
    board.spookyAnimate(item.text);
});
```

That’s how notifications are connected. The `onReveal()` function looks like this:

```ts
public onReveal(onRevealCallback: RevealedItemCallback) {
    this._revealedItemCallback = onRevealCallback;
}
```

It saves a callback, which is triggered by `raiseEventsForNewlyRevealedItems` when a new item is detected.

The `spookyAnimate()` function is nice and simple - we pass it the most recent detected character:

```ts
public spookyAnimate(value: string, duration: number = 3_000) {
    this._animationElement.innerHTML = value;
    this._animationElement.classList.add('animate');
    setTimeout(() => { this._animationElement.classList.remove('animate'); }, duration);
}
```

It sets the `innerHTML` of the `animation` div to the text of the detected character, and adds the CSS class `animate`, along with creating a timeout to remove the class in three seconds. We then use CSS animations to do all the hard work and give us a seasonally spoopy effect:

```css
.animate {
   animation: zoom 3s 1s ease-in 1 forwards;  
/* animation: name duration delay ease repeat direction */
}

@keyframes zoom {
  0% {
    transform: skew(0deg) scale(1);
    opacity: 1;
  }
  20% {
    transform: skew(-5deg) scale(5);
    opacity: 0.8;
  }
  40% {
    transform: skew(8deg) scale(10);
    opacity: 0.6;
  }
  60% {
    transform: skew(-7deg) scale(20);
    opacity: 0.4;
  }
  80% {
    transform: skew(4deg) scale(40);
    opacity: 0.2;
  }
  100% {
    transform: skew(0) scale(50);
    opacity: 0;
    filter: blur(50px);
  }
}
```

Over a period of three seconds, with a one second delay, we take the contents of the div and enlarge it, skew it back and forth, add a blur, and reduce its opacity until it disappears like smoke from an extinguished candle.

It's a slick effect for a relatively small amount of code.

### Resolution scaling

There's a lot more code than we've worked through inside of `Planchette.ts`, and that's because most of it has to do with handling the resolution scaling of the board and the planchette to cope with the fact that users may be playing at different resolutions.

One of the wrinkles in using the approach we have, where all of the clients "play" the same messages, and move their planchettes by the same amount, is that one pixel's worth of movement on one screen will be different to one pixel's movement on another. As a result, when we're processing our mouse and gyro movement deltas, we have to make sure they mean the same thing on each device.

To achieve this, the board operates at an **internal resolution** of 1240x768, which means that whenever we want to move something "one pixel", it's always calculated as "one pixel at 1240x768".

The `planchette` keeps track of its `location` as (x,y) coordinates. However, most of our calculations - like when we work out where the centre of the `planchette` viewfinder is, or how far over the edge of the board it can travel - are calculated based on the property `scaledLocation`.

```ts
private get scaledLocation() { return this.scaleCoordinate(this.location); }

private scaleCoordinate(coord: Coordinate) {
    const xPercent = coord.x / (1240 / 100);
    const yPercent = coord.y / (768 / 100);

    const onePercentXAtThisRes = this.parentBoardWidth / 100;
    const onePercentYAtThisRes = this.parentBoardHeight / 100;

    return { x: xPercent * onePercentXAtThisRes, y: yPercent * onePercentYAtThisRes };
}
```

`scaledLocation` takes the current `this.location` property and adjusts it for the user's screen resolution - working out what one percent of their horizontal and vertical resolution is and adjusting the numbers appropriately. By doing this, we make sure that when we run the collision detection code, we're going to detect the same character on two devices running at different resolutions, where the `planchette` has different absolute (x,y) coordinates on the screen.

This is the complicated part of synchronizing two or more clients with different output resolutions using purely client side calculations. An alternative approach would be to have only one client detect letters, and raise messages to keep everyone in sync.

For the scope of this project, just playing the events on each client seemed like the simplest path.

### Making the layout responsive

As with any responsive site, we don't know what screen size our users will be viewing the app on. We want to make sure that whatever size the board is, all of the users see the entire board (without scrolling), and see the planchette move to the same letters.

The board itself has a set aspect ratio, which needs to scale with the browser. This means that we need to take both the width and height of the browser into account.

First, we set a maximum width and height for the board so that it won't get too large on bigger screens. We don't want to give people eye strain when looking at the board! I chose 1240 and 768 to give a slightly widescreen graphic. Honestly, these numbers were mostly accidental, as I was designing the board.

The board graphic in the browser then has to scale as the window width gets narrower than 1240px, and as the height gets smaller than 768px.

![movement gif](https://media.giphy.com/media/lRVZHAsnT07uTnzbj5/giphy.gif "movement gif")

To do this we:

1. Make a container element for the board (`.board-holder`).

2. Set a `max-width` of 1240px and a `max-height` of 100vh on the container, so that it won't get too large or overflow the window height.

3. Create a media query which triggers when the height of the browser window is over 768px which decreases the `max-height` to 768px.

4. Set the background image container to be a picture of the board.

5. Use `background-size:contain` to make sure the background image always fits inside the constraints of either width or height.

```html
    <div class="board-holder">
        <svg viewBox="0 0 1240 768" ...></svg>
    </div>
```

```css
.board-holder {
    position: relative;
    max-width: 1240px;
    max-height: 100vh;
    margin: 0 auto;
    background: url(assets/bg.jpg) no-repeat center top;
    background-size: contain;
}
```

Inside the `board-holder` is the SVG which contains the character holders that we mentioned earlier. SVGs use a property called `viewBox` to set their aspect ratio. The `viewBox` is the tightest fitting rectangle that entirely encloses all of the SVG contents. In order to make our SVG scale with the board graphic, we set the `viewBox` to `viewBox="0 0 1240 768"`, and then set a maximum height in the CSS so that the SVG can't scale to be larger than its container:

```css
svg {
  max-height: 100vh;
}
```

## Technical Notes - Snowpack

We're using `snowpack` as a development server and build pipeline.

> Snowpack is a modern, lightweight toolchain for faster web development. Traditional JavaScript build tools like webpack and Parcel need to rebuild  & rebundle entire chunks of your application every time you save a single file. This rebundling step introduces lag between hitting save on your > changes and seeing them reflected in the browser.
>
> Snowpack serves your application unbundled during development. Every file only needs to be built once and then is cached forever. When a file changes, Snowpack rebuilds that single file. There’s no time wasted re-bundling every change, just instant updates in the browser (made even faster via Hot-Module Replacement (HMR)). You can read more about this approach in our Snowpack 2.0 Release Post.
>
> Snowpack’s unbundled development still supports the same bundled builds that you’re used to for production. When you go to build your application for production, you can plug in your favorite bundler via an official Snowpack plugin for Webpack or Rollup (coming soon). With Snowpack already handling your build, there’s no complex bundler config required.

Snowpack allows us to:

- Reference NPM modules from our front-end
- Do bundle-less development with native ES Modules
- Hot-Reload while working on our UI
- Build for production with one command
- Write TypeScript as if it were regular JavaScript, and have it compiled as we modify it

If you take a look in `package.json`, you'll notice there's a build task called `build:azure` - this is the task that the `Azure Static Web Applications` build process looks for, and it calls `npx snowpack build`.

This process will look at our web assets, and make sure it copies any `node modules` we're referencing in our HTML, and output the processed files into a directory called `build`.

The Azure pipeline looks for this as the location to publish our static site from, but if you want to see it running, you can run the same command on your computer.

You might have noticed that we've been writing TypeScript throughout this example, and TypeScript requires compiling before it can run in a web browser. Well, luckily, Snowpack just does this for us, so we've not had to configure any additional TypeScript build process, and everything just works transparently!

## Does it work?

Do you believe in ghosts? 👻

