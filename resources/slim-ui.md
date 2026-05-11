# Slim UI integration

We developed a lightweight UI of the Printess Editor that integrates seemlessly into your shop system.
It is not feature complete compared to our Panel UI, but it is way faster and does not require the user to leave the shop system at all.

A basic implementation of the Slim UI is very straightforward:

``` javascript
const r = await import("https://editor.printess.com/slim-ui.js");
const token = "[your-shop-token]"

const printess = await r.createSlimUi({
    previewContainer: document.querySelector(".printess-preview"),
    uiContainer: document.querySelector(".printess-ui"),
    previewImage: document.querySelector(".printess-preview-image"),
    loader: document.querySelector(".printess-image-loader"),
    shopToken: token,
    templateName: "Framed-Canvas-Slim",
    published: false,
    theme: "",
    lang: "de",
    textUpdateTimeout: "short",
    formFields: [{ name: "head", value: "Neue Überschrift" }]
});

document.getElementById("buttonBasket")
    .addEventListener("click", async () =>  {
        const data = await printess.createSaveToken();
        prompt("Save Token:", data.saveToken);
        prompt("Thumbnail Url:", data.thumbnailUrl);
    });
```

As you can see, the process is fairly similar to the Panel UI, the main difference being that you need to have at least a `<div class="printess-ui"></div>` in your webpage for the UI to attach itself to.

>`templateName` can also take the **save-token** you received from `createSaveToken()`.

Here you can see an example implementation of the Slim UI:

``` HTML
  
  <div class="main-grid">  
    
    <div class="printess-preview-container">
      <div class="printess-preview">
        <img class="printess-preview-image" />
        <div class="printess-image-loader">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10" />
          </svg>
        </div> 


      </div>
    </div>
    
    <div>
      <div class="printess-ui">
      </div>
      <button id="buttonBasket">Add to basket</button>
    </div>
  </div> 
  



  <script type="module">

    const r = await import("https://editor.printess.com/slim-ui.js"); 
    
    const token = "[your-shop-token]"

    const printess = await r.createSlimUi({
      previewContainer: document.querySelector(".printess-preview"),
      uiContainer: document.querySelector(".printess-ui"),
      previewImage: document.querySelector(".printess-preview-image"),
      loader: document.querySelector(".printess-image-loader"),
      shopToken: token, // "[your-shop-token]",
      templateName: "Framed-Canvas-Slim", // "Children's book",
      published: false,
      theme: "", 
      lang: "de",
      textUpdateTimeout: "short",
      formFields: [{ name: "head", value: "Neue Überschrift" }]
    });

     document.getElementById("buttonBasket") 
       .addEventListener("click", async () =>  {
          const data = await printess.createSaveToken();
          console.log(data);
          prompt("Save Token:", data.saveToken);
          prompt("Thumbnail Url:", data.thumbnailUrl);
       }); 
    
  </script>
```

This implementation does need additional styling to arrange the HTML elements in which the editor loads:

``` CSS
  body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }

    .main-grid {
      display: grid;
      grid-template-columns: 2fr 400px;
      gap: 20px;
    }

    input {
      font-size: 15pt;
    }

    .image-select-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
    }

    .image-select-list>* {
      width: 120px;
      height: 120px;
      margin: 5px;
      background-size: contain;
      background-position: 0% 0%;
      background-repeat: no-repeat;
    }

    p {
      margin-bottom: 3px;
      margin-top: 10px;
      text-align: center;
      line-height: 1.7;
    }

    h1 {
      margin: 0;
      padding: 0px;
      text-align: center;
    }

    header {
      margin: 0;
      padding: 15px;
      background: #eee;
      text-align: center;
    }

    button {
      margin-top: 10px;
    }

    .printess-ui {
      overflow: auto;
    }

    .printess-preview-container {
      position: relative;
      overflow: hidden;
    }

    .printess-preview {
      margin-top: 20px;
      height: 100%;
      max-height: 70vh;
      background-color: white;
      display: flex;
      align-items: start;
      justify-content: center;
    }

    .printess-preview-image.printess-loader-visible {
      opacity: .5;
    }

    .printess-preview-image {
      width: 100%;
      border: 1px solid #aaa;
      height: auto;
      opacity: 1;
      transition: opacity 0.5s;
      width: auto;
      height: auto;
      opacity: 1;
      transition: opacity 0.5s;
      max-height: 70vh;
      max-width: 100%;
    }


    .printess-image-loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 68px;
      display: none;
    }

    .printess-image-loader.printess-loader-visible {
      display: block;
    }

    .printess-image-loader:before {
      content: '';
      display: block;
      padding-top: 100%;
    }

    .printess-image-loader>.circular {
      animation: printess-loader-rotate 2s linear infinite;
      height: 100%;
      transform-origin: center center;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }

    .printess-image-loader>.circular>.path {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      animation: printess-loader-dash 1.5s ease-in-out infinite, printess-loader-color 6s ease-in-out infinite;
      stroke-linecap: round;
    }

    @keyframes printess-loader-rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes printess-loader-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }

      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
      }

      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
      }
    }

    @keyframes printess-loader-color {

      100%,
      0% {
        stroke: #d62d20;
      }

      40% {
        stroke: #0057e7;
      }

      66% {
        stroke: #008744;
      }

      80%,
      90% {
        stroke: #ffa700;
      }
    }

    @media (max-width: 900px) {
      .main-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        gap: 0px;
        height: auto;
      }

      .printess-preview-image {
        max-height: 350px;
        width: auto;
      }

      .printess-ui {
        padding: 20px;
      }
    }
```

## Loading Parameters

You give the `createSlimUi()` call an object that has to contain some data in order for it to work, such as a correct `templateName`, `shopToken` and `uiContainer`.

Additionally, some loading parameters give you options to influence the state in which the UI is initialized.

### Initial Form Field values

`formFields` accepts an array of objects, each containing the name of a form field and the value you want to be selected initially.

::: externallink https://codepen.io/Printess/pen/bNwRwZM|You can see a life demo of this here

### Merge Snippet on load

The `layout` value accepts a string containing a Layout Snippet ID, which will be merged when the template is loaded.

You can find your Layout Snippet ID in the Account Portal.

::: externallink https://codepen.io/Printess/pen/xbEXQXd|See a demo of this

### Load Layout Snippet selection

If you want your users to be able to select a Layout Snippet for their customisation, you need to give the loader the loadingParameter `layoutSnippetSearchTags`, which accepts an array of tags as strings, such as `layoutSnippetSearchTags: ["slim-portrait", "printess-canvas-portrait"]`.

The menu only loads if you have at least one of the tags selected in the template in the Printess Editor and it only loads the tags selected there.

You can also load a Keyword Menu with the `layoutSnippetMenuId` loading parameter.


### Initial Keyword Menu

If you want the snippet selection menu to start on a specific Category and Topic, you can use `initialCategory: string` and `initialTopic: string` to select the correct one.

## API

The `createSlimUi()` call returns a reference to a JS/TS api, which you can utilise to enrich your shop with more functionality.

You can find the whole api in ./resources/slim-ui.d.ts

## Slim UI use cases

Following are some code examples of use cases that were inspired by our customers.

### Switching to the Panel UI

The benefits of the SlimUI come at a cost: It is not feature complete compared to the full Printess editor which you can use through the PanelUI.
You might have a product that most of your users can easily customize to their wishes through the Slim options, but some want to take more control.
For these you can offer a switch to the full editor experience in two simple steps.

First you must save the current state of settings in the slimUI to a saveToken: `await slimApi.createSaveToken()`.

You can then use this saveToken to load the state in the PanelUI after loading it:

``` javascript
const printessPanel = await printessPanelLoader.load({
    token: "[your-shop-token]",
    templateName: "Framed-Canvas-Slim",
    templateVersion: "published",
    basketId: "Some-Unique-Basket-Or-Session-Id",
});

printessPanel.api.load(data.saveToken);
printessPanel.ui.show();
```

