---
name: printess-editor-integration
description: Use this skill when you need to set up a Printess Editor integration.
---

# Printess Editor Integration

The Printess Editor is very simple to integrate into your website in a baseline, out of the box way.

The following chapter will not only teach you how to implement these simple techniques but also dive deeper into ways to make the Printess Integration your very own, utilising parameters and our APIs to build the shop you envision.

## Architecture

The Panel-UI is web-component base and very easy to work with for developers. You get full control over the Printess Editor through its API.
You can set the initial state of your Editor through the attach parameters, listen to events in with callbacks and manipulate the live state with more API methods.

The Panel-UI also offers much more customization options. You can create themes and remove or move every panel in its position through the Theme Manager.

## Getting Started

### samples on CodePen

We have created a CodePen profile to provide you with live examples of various use cases.

### Basic Integration (recommended):

The most basic and straightforward integration of the Panel UI will work like this.
Printess will automatically determine screen size and device and attach itself in the foreground when loaded.

**Note:** If you don't specify anthing else, the Printess Editor will adapt to the users' browser language.


The implementation is as simple as this:
```html
<script type="module">
   const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");
    const printess = await printessLoader.load({
      token: "[your-shop-token]",
      templateName: "[your-template-name]",
      templateVersion: "published",
      basketId: "Some-Unique-Basket-Or-Session-Id",
      addToBasketCallback: (saveToken, thumbnailUrl) =>
        {
          prompt("Savetoken:", saveToken)
        }
    })
</script>
```
---
> **IMPORTANT**
>
>The `printessLoader.load()` call returns your interfaces into the editor, `ui` and `api`.
>
>`ui` is used to manipulate the UI of the editor, such as closing and reopening it.
>
>`api` gives you access to template resources, functions and lots of other tools for the editor.
>
>You can find out more on this in the TypeScript API resource and see examples in the Use Cases resource.
---


### Custom Div Integration

You also can provide a `<div>` for Printess to attach itself to. The following example also shows how to **show** and **hide** the editor with avoiding interference on your shop site:

``` html
<button id="close">CLOSE</button>
<button id="open">OPEN</button>
<p id="msg" >Click to hide the editor</p>
<div id="printess-editor"  style="">

<script type="module">
  const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");
  const printess = await printessLoader.load({
    token: "[your-shop-token]",
    templateName: "Baby Photo Book",
    templateVersion: "published",
    addToBasketCallback: (token, thumbnailUrl) => {
      prompt("Savetoken: ", token );
    },
    basketId: "Some-Unique-Basket-Or-Session-Id",
    container: document.getElementById("printess-editor"),
  })

  document.getElementById("close").addEventListener("click", () =>
  {
    printess.ui.hide();
    document.getElementById("printess-editor").style.display = "none";

    document.getElementById("open").style.display = "block";
    document.getElementById("close").style.display = "none";
    document.getElementById("msg").innerText="Click to show the editor";
  })

  document.getElementById("open").addEventListener("click", () =>
  {
    document.getElementById("printess-editor").style.display = "block";
    printess.ui.show();

    document.getElementById("open").style.display = "none";
    document.getElementById("close").style.display = "block";
    document.getElementById("msg").innerText="Click to hide the editor"
  })
</script>
```

> Important:
>You will need to style the div that the editor attaches to so the editor will not claim the whole browser for itself.
>We generally recommend implementing the **editor in fullscreen** if possible.
>If you need to have the editor surrounded by other elements, you need to make sure that they behave consistent to the editor, for example by invoking the same function that handles the `backButtonCallback` when a user navigates away from the editor page.
>If you want to display _anything_ other than the Editor, you **need** to style its container, for example like this:

``` css
#printess-editor {
  background-color: white;
  position: absolute;
  left: 30px;
  right: 30px;
  top: 60px;
  height: calc(100% - 90px);
  outline: 3px solid red;
  overflow: hidden;
}
```

By giving surrounding HTML elements the class `printess-owned`, the Editor will hide them while it is being displayed and show them when it becomes hidden.
This way your elements and the Editor don't need to use ugly methods such as `z-index` to figure out what should be visible.


## Required Attach Parameters

Following are the parameters which are needed to load the Printess Editor, without them the process will fail.

There are more optional attach parameters available - you can use them to personalise your editor integration or achieve more complex workflows.
You can find more info on them in [here](../resources/attach-params.md).

```js
const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");

const printessApi = await printessLoader.load({
  token: "[your-shop-token]",
  translationKey: "en",
  templateName: "Baby Photo Book",
  templateVersion: "published",
  basketId: "Some-Unique-Basket-Or-Session-Id",
})
```

### token

```js
 token: "[your-shop-token]"
```

`token` should be set to a **Shop-Token** which points to your Printess account. You can retrieve this token once you are logged in (Printess Editor -> Account Menu -> API-Token). You'll see 2 different tokens in the dialog. Always use the **Shop-Token** in the frontend.

### templateName and templateVersion

```js
templateName: 'Baby Photo Book',
templateVersion: "published"
```

`templateName` is required and specifies the name of the Template to load.
`templateName` can also take the **save-token** you received from the `back` or `basket` callback and load it directly.

`templateVersion` can be *draft* oder *publish* default is published and this is what you always should use in your live shops.


### basketId and shopUserId


```js
basketId: "Some-Unique-Basket-Or-Session-Id"
```

To allow your customer to upload images and save/load their work - you need to set the `basketId`.

Alternatively you can set a `shopUserId` to make Printess store the context of the current customer (user) so when the customer uploads an image it will be stored under the `shopUserId`. Thus, when the customer returns later they will see all of their previously uploaded images.

## Additional Resources

If you want to know more concepts in greater detail, there are additional chapters surrounding the Editor integration.

| Name | Location | When to consult |
|------|----------|-----------------|
| [Attach Parameters](./resources/attach-params.md) | If you want to load additional resources or configure the editor on initial load |
| [Use Cases](./resources/use-cases.md) | If you want to add a new Editor functionality, we might have an example of it already |
| [TypeScript API](./resources/printess-editor.d.ts) | If you want to add new Editor functionality, but we do not have an example already |
| [Price Display](./resources/price-display.md) | If you need to display and update Price information in the editor |
