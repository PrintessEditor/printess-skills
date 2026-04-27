
# Use Cases and Examples

Following are some of the use cases of our JS API that we have collected over the years.
All of them are accompanied by a codepen, so you can easily see what the code does and even play around with it and apply it to your specific needs.


## Load different templates after initializing

You might want to display the Printess editor embedded in a page that offers some of your own inputs, and depending on their value, switch, which template is loaded.

This is achievable by initialising the editor and later triggering the `loadTemplateAndFormFields()` function when a relevant value changes.

```js
  let printessEditor = null;

  async function loadTemplate(templateName) {
    // disabling the template switch so users don't click while we are loading
    document.querySelectorAll("button").forEach((btn) => {
        btn.disabled = true;
      });

    if(!printessEditor) {
      //Editor has not been initialized yet
      printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");

      printessEditor = await printessLoader.load({
        token: "[your-shop-token]",
        templateName: templateName,
        templateVersion: "draft",
        container: document.querySelector(".editor-wrapper"),
        basketId: "Some-Unique-Basket-Or-Session-Id",
        addToBasketCallback: (token, thumbnailUrl) => prompt("Savetoken:",token)
      });
  } else {
    //Editor has been initialized before

    //Second parameter are the merge templates and third parameter are the form fields
    await printessEditor.api.loadTemplateAndFormFields(templateName, [], [], null);
  }
  // users are allowed to click again
  document.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });
}
```


## Select a Spread

You can jump to a document and spread in your template after a user action by using `selectDocumentAndSpread(docId: string, spreadIndex: number, part?: "entire" | "left-page" | "right-page"): Promise<void>`.

Note that `spreadIndex` in this context does not reference the unique ID of the spread, but instead its position in the `spreads` array of the document.

The data needed for this method can be found by using `getAllDocsAndSpreads(): iExternalDocAndSpreadInfo[]`, which will return an array containing all documents in your template.
Each document contains `spreads`, an array of `iExternalSpreadInfo`.

```js
const selectDocumentByTitle = async () => {
  const title = "YOUR_DOCUMENT_TITLE";

  const allDocsAndSpreads = await printessApi.api.getAllDocsAndSpreads();
  if(allDocsAndSpreads) {
    const titledDoc = allDocsAndSpreads.find(doc => doc.docTitle === title);
    if(titledDoc) {
      await printessApi.api.selectDocumentAndSpread(titledDoc.docId, 0);
    }
  }
}
```


## Disabling select options

Depending on factors you might want to disable some options in a Select Form Field, for example if some materials are temporarily out of stock.

You can use the API function `setFormFieldListDisabledStates`:
```js
setFormFieldListDisabledStates(
  ffName: string,
  states: {
    disabled: boolean;
    value: string;
  }[]
): Promise<void>
```

In this function you can specify the `disabled` state for each value the form field with the name `ffName` needs.


## Detecting if a user scrolled to the bottom

The Printess API gives you a method to check if a user has scrolled all the way to the bottom of your document.
This might be helpful if you want to make sure they have seen everything inside the template or if you want to notify them of something they might have overlooked on their way there.

The method is `isScrolledToBottom(): boolean`, and you could check it periodically like this:

```js
window.setInterval(() => {
  console.log("isScrolledToBottom() = " + printess.api.isScrolledToBottom())
}, 700);
```


## Setting spine width

If you are creating a photobook, you might want to change its spine width depending on settings, for example the material of pages or other quality settings.
The API offers `setSpineFormular(formular: string): Promise<void>`.

The formular can be simply a singular value or a more complex formular, depending on the number of pages for example.
```js
printess.api.setSpineFormular("200px");
// or
printess.api.setSpineFormular("=spine.pages * 0.3mm");
```


## Getting the position of a selected frame

If you need to find the postion of the currently selected frame, for example to display a UI hint to your users, you can find it by calling `getSelectionPosition()`.
This returns an object containing the positional data of the frame, which you can access.
If no frame is selected, it will return `null`, so make sure to check for that before drilling into the object!

```js
{
  anchorX: "left" | "center" | "right";
  anchorY: "top" | "bottom" | "middle";
  containerPosition: {
    height: number;
    left: number;
    top: number;
    width: number;
  };
  height: number;
  left: number;
  rotation: number;
  rotationPositionX: number;
  rotationPositionY: number;
  top: number;
  width: number;
}
```

In our example below, we have used the positional data to draw a red border around the frame, highlighting how you can access any border.


## Updating the price display when a relevant Form Field changes

If you have price relevant form fields set up in your template and are using the Printess price display, you probably want to update the displayed price whenever a price relevant form field changes.

In order to achieve this, you will need at a callback and an API call.
There are two callbacks available to notofy you, when a price relevant form field has changed, `formFieldChangedCallback` and `priceChangeCallback`.

::: tip
You need to update your price in the `priceChangeCallback`, otherwise it will not be displayed correctly.
:::

`formFieldChangedCallback` will trigger, when a price-relevant form field changes and return the form field that has actually changed and the new value.
This callback will not be triggered when a price-relevant Snippet changes!
It's the easiest way to access the data that has changed without having to traverse an object looking for the new values.

`priceChangeCallback` will trigger whenever anything price-related changes, which can include Snippets.
It comes with **all** price relevant settings, no matter what actually changed to trigger it.
Theroretically this is the only callback you need, but if you want to pinpoint the actual change, it can be easier to use `formFieldChangedCallback` as well!

One or both of these callbacks and the price info from your shop system give you all the information you need in order to recalculate the price.

Once you know the new price, you can call `api.ui.refreshPriceDisplay()` inside the `priceChangeCallback` with your data:

```js
const price = 9.99 // Your calculated price as a (decimal) number
api.ui.refreshPriceDisplay({
  snippetPrices: [],
  priceCategories: {},
  price: price + "€",
  productName: "My product",
  legalNotice: "Taxes & shipping included",
  infoUrl: ""
});
```


## Detecting an image upload

You can detect an image upload by the user by utilising the `imageListChangeCallback`.
This callback fires whenever the image list changes, which means it also does whenever a user deletes an image.
However, by calling `api.getImages()`, you can get the list of user uploaded images and compare it to prior state, which enables you to filter for additions.
You can detect image deletion in a similar manner.

```js
const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");

let printessApi = null;
let images = [];

const imageListChanged = () => {
  const imageList = printessApi ? printessApi.api.getImages() : [];
  if(imageList.length > images.length) {
    window.alert("An image was uploaded!")
  }
  images = imageList;
}

  printessApi = await printessLoader.load({
    token: "[your-shop-token]",
    templateName: "Canvas",
    templateVersion: "published",
    imageListChangeCallback: () => imageListChanged(),
});
```


## Preloading the Printess Editor

If performance is a big concern of yours, you can accelerate the loading process of Printess through preloading.

For this you need to edit your webpage both in the `<head>` tag as well as the `<body>` tag.

The `<head>` needs to contain a link to our preload.js:

`<link rel="preload" href="https://editor.printess.com/v/3.0.0/preload.js" as="script">`

The body needs to add the preloaded scripts as a script tag:
```
<script>
  const usedLaterScript = document.createElement("script");
  // use EXACTLY the same url as in preload, otherwise it will be loaded in blocking mode!
  usedLaterScript.src = "https://editor.printess.com/v/3.0.0/preload.js";
  document.body.appendChild(usedLaterScript);
</script>
```

::: warn
The URLs of the link inside your `<head>` and the source inside the `<script>` need to match **exactly**.
:::


## Loading previously uploaded images

If your users want to use images that they uploaded earlier or in a different project, you can load up to 50 images through the API method `importUserUploadedImages()`.
This method accepts up to two parameters, `shopUserId` and `basketId`, both being optional.

Note that user uploaded images are only kept for as long as the latest [saveToken](#save-token-settings) using them has been generated.

`printess.api.importUserUploadedImages("unqiue-user-id-or-guid", "unique-per-session-guid");`

If you call the method with both parameters, it returns images that belong both to the given `userId` as well as `basketId` (which can be different from your currently open editor session).

You may call the method with only the `basketId`, in which case only images uploaded to that session will be loaded.

Lastly, you may also call the method with only a `userId`, pulling from all images the user uploaded to any project.

::: warn
Your user IDs need to be **UNIQUE** and **NOT GUESSABLE**, otherwise you risk your users data security.

**Avoid plain integer IDs** if you intend to use this feature.
:::


## Using template scripts through the API

You can set up your templates with great functionalities using [template scripts](#template-scripts), and setting triggers to execute them throughout the template.
However, you can also execute them with the api function `executeScript(scriptName: string, args: string[]): string | Promise<string>`.

Note, that neither parameter of the function is optional, so if your script does not need any parameters, you will have to set the `args` to `[]`, as we did in our example code:

``` javascript
const countThroughApi = () => {
  if(printessApi) {
    printessApi.api.executeScript("count", [])
  }
}
```

Printess template scripts can have a return value, so naturally the `executeScript` forwards the return value of the script you execute, given the script does have one.


## Retrieve Animation HTML

You can get animations you created as HTML to easily integrate them into your website through the `getAnimationHtmlAsString()` method, which responds with an object containing `pxWidth`, `pxHeight` and `data`, the latter being the HTML string.

As you can see in our example linked below, you can then use this as the source for an HTML element.

``` javascript
const r = await printess.api.getAnimationHtmlAsString();
if (r) {
  const iFrame = document.createElement("iframe");
  console.log("getAnimationHtmlAsString:", r);
  iFrame.srcdoc = r.data;
  iFrame.classList.add("printess-owned");
  iFrame.setAttribute("sandbox", "allow-scripts allow-popups allow-same-origin allow-presentation");
  iFrame.setAttribute("style", `
    position: absolute;
    z-index: 99999999;
    left: 50%;
    top: 100px;
    width: ${r.pxWidth}px;
    height: ${r.pxHeight}px;
    background: white;
    box-shadow: black 2px 2px 10px;
    border: 20px solid #ccc;
    box-sizing: content-box;
    transform: translate(-50%, 0);
  `);
}
```

