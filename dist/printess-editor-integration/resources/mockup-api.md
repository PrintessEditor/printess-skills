# Mockup Service

The Printess **Mockup Service** enables you to offer **Mockups** dynamically and for any variety of personalized products in seconds. It applies **Buyer's** content from a **Save Token** to other **Templates**. It enables you to create dynamic previews. This could be a **Layout Snippet** Selection applied to the product picture or a fully **personalized Thumbnail** in the **Shopping Basket**. Or you can use **personalized Thumbnails** for **upselling** as well as for **targeted campaigns** and **re-marketing**.

The Printess API provides two powerful endpoints for generating product mockups, enabling you to create dynamic visual representations of customized products for various use cases including customer shops, marketing campaigns, and B2B catalogs.

## Overview

[The API](https://api.printess.com/swagger) offers two distinct approaches to mockup generation:

1. **Frontend URL Creation** (`/saas/mockup/url/create`)
    - Generate mockup URLs directly from your frontend for customer-facing applications
    - Uses Shop Token

2. **Backend Image Generation** (`/saas/mockup/url/generate`)
    - Create temporary mockup images via backend services that are deleted after 24 hours
    - Uses Service Token

The required bearer tokens can be accessed in the [Account-Portal](https://account.printess.com/#account) or from the editor.

## Endpoints

### 1. Create Mockup URL

**Endpoint:** `/saas/mockup/url/create`

**Purpose:** Generate dynamic mockup URLs that can be used directly in customer shops after products have been processed through the normal Printess workflow.

**Important Notes:** This endpoint creates a url, which leads to the image rendering serverside _when requested_.
The url of the image that is generated can get _very_ long, depending on the individual parameters of the **Mockup**.

**Authentication:** Shop Token

**Use Cases:**
- Customer shop integration after product customization
- B2B brand catalog generation
- Real-time mockup display for customized products

**Example Usage:**

```javascript
const shopToken = "..."; // from your Account Portal or Editor

async function createMockupUrl(mockupRequestBody) {
    const response = await fetch("https://api.printess.com/saas/mockup/url/create", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + shopToken
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(mockupRequestBody)
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const result = await response.json();
    return result.url;
}
```

### 2. Generate Mockup Image

**Endpoint:** `/saas/mockup/url/generate`

**Purpose:** Create temporary mockup image URLs.

**Authentication:** Service Token (Backend only)

**Important Notes:**
- Generated images are automatically deleted after 24 hours
- Must save images to external storage for longer-term use
- Use cases for marketing emails, upselling campaigns, and promotional materials

## Request Schema

```javascript
const mockupRequestBody = {
  // Core template configuration
  templateName: "string",
  userId: "string",
  documentName: "string",
  published: true,
  contentTemplateName: "string",

  // Rendering specifications
  pagesToSkip:  0,
  maxWidth:  1000,
  maxHeight: 1000,

  // Dynamic content insertion
  formFields: {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },

  // Template merging (up to 3 merge operations)
  merge1: "string",
  merge1document: "string",
  merge1targetDocument: "string",
  merge2: "string",
  merge2document: "string",
  merge2targetDocument: "string",
  merge3: "string",
  merge3document: "string",
  merge3targetDocument: "string",

  // Snippet content integration
  snippetUrl: "string",
  snippetTargetDocumentName: "string"
};
```

### Core Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `templateName` | string | Yes | Target template for mockup generation |
| `userId` | string | No | User identifier |
| `documentName` | string | Yes | Template document to apply |
| `published` | boolean | No | Use published version of template |
| `contentTemplateName` | string | **MANDATORY** | Data source template (saveToken from customized product) |

### Rendering Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pagesToSkip` | number | 0 | Number of pages to skip in spread |
| `maxWidth` | number | 1000 | Maximum image width in pixels |
| `maxHeight` | number | 1000 | Maximum image height in pixels |

### Dynamic Content

| Parameter | Type | Description |
|-----------|------|-------------|
| `formFields` | object | Key-value pairs for dynamic content insertion |

Example:
```javascript
formFields: {
    "Name": "John Doe",
    "phoneNumber": "+1-555-0123",
    "color": "green"
}
```

### Template Merging

The API supports up to 3 merge operations for complex template combinations:

| Parameter Group | Description |
|-----------------|-------------|
| `merge1`, `merge1document`, `merge1targetDocument` | First merge operation |
| `merge2`, `merge2document`, `merge2targetDocument` | Second merge operation |
| `merge3`, `merge3document`, `merge3targetDocument` | Third merge operation |

The `merge1`-key would be the template name, `merge1document` the document inside that
and `merge1targetDocument` the document inside the target document to apply to.

### Snippet Integration

| Parameter | Type | Description |
|-----------|------|-------------|
| `snippetUrl` | string | URL to snippet content |
| `snippetTargetDocumentName` | string | Target document for snippet insertion |

## Example Request

```javascript
const mockupRequestBody = {
    // Core configuration
    templateName: "mug-template",
    userId: "user123",
    documentName: "standard-mug-preview",
    published: true,
    contentTemplateName: "...", // From customized product

    // Rendering settings
    pagesToSkip: 0,
    maxWidth: 1000,
    maxHeight: 1000,

    // Dynamic content
    formFields: {
        "Name": "Jane Smith",
    },

    // Template merging
    merge1: "background-template",
    merge1document: "bg-doc",
    merge1targetDocument: "main-doc"
};

// Usage
const mockupUrl = await createMockupUrl(mockupRequestBody);
console.log("Generated mockup URL:", mockupUrl);
```

## CodePen examples

The following examples are simplified template products, customize the product and add them to the basket to trigger the mockup generation.

The Printess - Create Mockup on Add to Basket illustrates a simple example of applying a template to generate pictures from another one:
``` HTML
<div id="mockups">
  </div>

  <div id="printess-editor"
    style="background-color: white; position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;"></div>


<script type="module">
  const shopAuthToken = "YOUR_SHOP_TOKEN";

  export async function createMockupUrl(data, saveToken) {
    const response = await fetch("https://api.printess.com/saas/mockup/url/create", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + shopAuthToken
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        templateName: data.templateName,
        documentName: data.documentName,
        pagesToSkip: data.page,
        formFields: data.formFields,
        contentTemplateName: saveToken
      })
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();

    return result.url;
  }

  export async function loadPrintess(templateName, addToBasketCallback) {
    // @ts-ignore
    const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");
    const printess = await printessLoader.load({
      token: shopAuthToken,
      templateName: templateName,
      templateVersion: "draft",
      basketId: "Some-Unique-Basket-Or-Session-Id",
      addToBasketCallback,
      container: document.getElementById("printess-editor")
    });
    return printess.api;
  }
  export async function renderMockups(host, templates, saveToken) {
    for (const c of Array.from(host.children)) {
      c.remove();
    }
    for (const mockup of templates) {
      const div = document.createElement("div");
      const image = document.createElement("img");
      const mockupUrl = await createMockupUrl(mockup, saveToken);
      image.src = mockupUrl;
      image.className = "mockup-image";
      div.dataset["templateName"] = mockup.templateName;
      div.dataset["saveToken"] = saveToken;
      div.className = "mockup-div";
      div.appendChild(image);
      host.appendChild(div);
    }
  }

  function onAddToBasket(saveToken, thumbnailUrl) {
    printess.detachAllHandlers();
    document.getElementById("printess-editor").style.display = "none";
    renderMockups(
      document.getElementById("mockups"), [{
        templateName: "Photo Mug",
        documentName: "Preview",
      }], saveToken)
  }

  const printess = await loadPrintess("Photo Mug", onAddToBasket);
</script>
```

This Printess - Create Mockup with Multiple Pages  shows how to generate thumbnail images via the Mockup Service of the same template by iterating through the pages via the body parameters:
``` HTML
<div id="mockups">
  </div>

    <div id="printess-editor" style="background-color: white; position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;">
    </div>


<script type="module">
  const shopAuthToken = "YOUR_SHOP_TOKEN";

  export async function createMockupUrl(data, saveToken) {
    const response = await fetch("https://api.printess.com/saas/mockup/url/create", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + shopAuthToken
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        templateName: data.templateName,
        documentName: "Document",
        pagesToSkip: data.page,
        contentTemplateName: saveToken
      })
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();
    return result.url;
  }

  export async function loadPrintess(templateName, addToBasketCallback) {
    // @ts-ignore
    const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");
    const printess = await printessLoader.load({
      token: shopAuthToken,
      templateName: templateName,
      templateVersion: "draft",
      basketId: "Some-Unique-Basket-Or-Session-Id",
      addToBasketCallback,
      container: document.getElementById("printess-editor")
    });
    console.log(printess);
    return printess.api;
  }
  export async function renderMockups(host, templates, saveToken) {
    for (const c of Array.from(host.children)) {
      c.remove();
    }
    for (const mockup of templates) {
      const div = document.createElement("div");
      const image = document.createElement("img");
      const mockupUrl = await createMockupUrl(mockup, saveToken);
      image.src = mockupUrl;
      image.className = "mockup-image";
      div.dataset["templateName"] = mockup.templateName;
      div.dataset["saveToken"] = saveToken;
      div.className = "mockup-div";
      div.appendChild(image);
      host.appendChild(div);
    }
  }

  function onAddToBasket(saveToken, thumbnailUrl) {
    printess.detachAllHandlers();
    document.getElementById("printess-editor").style.display = "none";
    renderMockups(
      document.getElementById("mockups"), [{
        templateName: "Baby Photo Book",
        page: 0
      }, {
        templateName: "Baby Photo Book",
        page: 1
      }, {
        templateName: "Baby Photo Book",
        page: 2
      }, {
        templateName: "Baby Photo Book",
        page: 3
      }, {
        templateName: "Baby Photo Book",
        page: 4
      }, {
        templateName: "Baby Photo Book",
        page: 5
      }, {
        templateName: "Baby Photo Book",
        page: 6
      }, {
        templateName: "Baby Photo Book",
        page: 7
      }], saveToken)
  }

  const printess = await loadPrintess("Baby Photo Book", onAddToBasket);
</script>
```

In the Printess - Create Mockup with Form Field  Variations a simple T-Shirt Template is used to showcase the formFields-parameter to generate mockups with different colors:
``` HTML
<div id="mockups">
  </div>

  <div id="printess-editor"
    style="background-color: white; position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;"></div>


<script type="module">
  const shopAuthToken = "YOUR_SHOP_TOKEN";

  export async function createMockupUrl(data, saveToken) {
    const response = await fetch("https://api.printess.com/saas/mockup/url/create", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + shopAuthToken
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        templateName: data.templateName,
        documentName: data.documentName,
        pagesToSkip: data.page,
        formFields: data.formFields,
        contentTemplateName: saveToken
      })
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();

    return result.url;
  }

  export async function loadPrintess(templateName, addToBasketCallback, formFieldChangedCallback) {
    // @ts-ignore
    const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");
    const printess = await printessLoader.load({
      token: shopAuthToken,
      templateName: templateName,
      templateVersion: "draft",
      basketId: "Some-Unique-Basket-Or-Session-Id",
      addToBasketCallback,
      container: document.getElementById("printess-editor"),
      formFieldChangedCallback,
    });
    return printess.api;
  }
  export async function renderMockups(host, templates, saveToken) {
    for (const c of Array.from(host.children)) {
      c.remove();
    }
    for (const mockup of templates) {
      const div = document.createElement("div");
      const image = document.createElement("img");
      const mockupUrl = await createMockupUrl(mockup, saveToken);
      image.src = mockupUrl;
      image.className = "mockup-image";
      div.dataset["templateName"] = mockup.templateName;
      div.dataset["saveToken"] = saveToken;
      div.className = "mockup-div";
      div.appendChild(image);
      host.appendChild(div);
    }
  }

  function formFieldChangedCallback(name, value, tag, label, ffLabel) {
     console.log(name, value, tag, label, ffLabel);
  }

  function onAddToBasket(saveToken, thumbnailUrl) {
    printess.detachAllHandlers();
    document.getElementById("printess-editor").style.display = "none";
    renderMockups(
      document.getElementById("mockups"), [{
        templateName: "Photo T-Shirt",
        documentName: "Preview",
        page: 0,
        formFields: {
          "tshirtColor": "red"
        }
      },{
        templateName: "Photo T-Shirt",
        documentName: "Preview",
        page: 0,
        formFields: {
          "tshirtColor": "blue"
        }
      },{
        templateName: "Photo T-Shirt",
        documentName: "Preview",
        page: 0,
        formFields: {
          "tshirtColor": "black"
        }
      }], saveToken)
  }

  const printess = await loadPrintess("Photo T-Shirt", onAddToBasket, formFieldChangedCallback);
</script>
```

## Workflow Integration

### Typical Frontend Flow

1. Customer customizes a product (e.g., t-shirt with custom image)
2. Printess workflow processes the customization and generates a `saveToken`
3. Use the `saveToken` as `contentTemplateName` in mockup request
4. Generate mockups for alternative products (mugs, pillows, bags, etc.)
5. Display mockups in customer shop for cross-selling opportunities

### Backend Marketing Flow

1. Retrieve processed product data with `saveToken`
2. Use `/saas/mockup/url/generate` with Service Token
3. Generate temporary mockup images
4. Download and save images to your storage system
5. Use images in email campaigns, promotional materials, etc.

## Use Case Examples

### E-commerce Cross-selling
Customer designs a custom t-shirt → Generate mockups for mugs, phone cases, and tote bags → Display as "Also available on" options

### B2B Catalog Generation
Brand uploads logo and content → Generate mockups across entire product catalog → Create branded product showcase

### Email Marketing
Completed custom order → Generate product mockups → Include in order confirmation and promotional emails