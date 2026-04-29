# Additional Attach Parameters

Additionally to the required standard attach parameters **token** and **templateName**, there are other parameters that can change the the behavior and look of your template from within your online store.
With a few exceptions (e.g. the theme parameter) these are working with the classic iFrame-Ui as well as with the Panel- Ui.

You can find an extensive and always up-to-date list in our resorce **printess-editor.d.ts**, by searching for `interface printessAttachParameters`.


The described parameters are just additional properties that are added to your attach parameter object alongside the templateName and token parameters.

Panel-Ui:

```js
const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");

const printessApi = await printessLoader.load({
    token: "[your-shop-token]",
    templateName: "Baby Photo Book",
    templateVersion: "published",
    formFields: [],
    formFieldProperties: [],
    translationKey: "en",
    basketId: "Some-Unique-Basket-Or-Session-Id"
    addToBasketCallback: (saveToken, thumbnailUrl) =>
    {
        prompt("Savetoken:", saveToken)
    }
});
```

# Translations

Printess will automatically detect the browser language of your users and translate labels and hints by default.
Your localisation can be controlled through attach parameters as well, should you choose to overwrite the options that Printess provides you or ignore your users' browser language and take more direct control of i18n.

#### translationKey

```js
const printessApi = await printessLoader.load({
    token: "[your-shop-token]",
    templateName: "Baby Photo Book",
    templateVersion: "published",
    basketId: "Some-Unique-Basket-Or-Session-Id",
    addToBasketCallback: (saveToken, thumbnailUrl) =>
    {
        prompt("Savetoken:", saveToken)
    },
    translationKey: "en"
});
```
You can set a translation key. It sets a fixed language and removes the setting to use the browser language.

#### translations

``` js
const printessApi = await printessLoader.load({
    token: "[your-shop-token]",
    templateName: "Baby Photo Book",
    templateVersion: "published",
    basketId: "Some-Unique-Basket-Or-Session-Id",
    addToBasketCallback: (saveToken, thumbnailUrl) =>
    {
        prompt("Savetoken:", saveToken)
    },
    translationKey: "en",
    translations: {
    "custom": {
        "name": "Your Name" // you can also access this translation in documents with ${gl("custom.name")}
    }
    }
});
```
You can specify your own translations object to overwrite Printess standard localisations, enriching your account wide translation table with template specific entries.

# Themes

To load a specific theme you need to set the `theme` name like you defined it in the **Theme Editor**.

```js
const printessApi = await printessLoader.load({
    token: "[your-shop-token]",
    templateName: "Baby Photo Book",
    templateVersion: "published",
    basketId: "Some-Unique-Basket-Or-Session-Id",
    addToBasketCallback: (saveToken, thumbnailUrl) =>
    {
        prompt("Savetoken:", saveToken)
    },
    theme: "theme-name"
});
```



# Setting form field values

Using the "formFields" property, it is possible to preselect one or more specific form field values.
This is the way to go if you want to prefill form fields with data you collected before loading the editor or need to set a form field value initially for another reason.
The names must match names you have set in your Printess template.

```js
formFields: [
    {
        name: "color",
        value: "Marine Blue"
    },
    {
        name: "DOCUMENT_SIZE",
        value: "21.0x29.7"
    }
]
```

This example will prefill a form field called **color** with the value **Marine Blue** and a form field called **DOCUMENT_SIZE** with the value "21.0x29.7".

# Set Page Count

If you create a template with a varying number of pages and give the user the ability to add or subtract pages, Printess will automatically create a hidden form field called "PAGE_COUNT".

You can set "PAGE_COUNT" to an initial value with the attach parameter `bookInsidePages: number`.


# Setting table form field values

A more complex example for setting form field values is the prefilling of table values. For that, a string containing a serialized json representation of row values is provided.
As an example, the wine menu from the editor example templates is used. Each row in the table represents one line in the vine menu. The type column decides if it is a headline (group)
or a wine entry (item). Then there is a price display for 2 different sizes (glass / bottle) and a short wine description (details).

The following script will replace the original table entries Chianty, Bordeux, Premier Cru, Chardonny, Sauvignon with Cabernet Sauvignon, Merlot, Pinot Noir, Chardonnay, Sauvignon Blanc and Gewürztraminer.
For better readability, the table contents are split up in one item per row instead of one big array containing everything and put together to one array at the end.


```js
    //Red wine headline
    const groupRedWine = {
        "type": "group",
        "wine": "Red",
        "glass": "Glass",
        "bottle": "Bottle",
        "details": ""
    };

    //White wine headline
    const groupWhiteWine = {
        "type": "group",
        "wine": "White",
        "glass": "",
        "bottle": "",
        "details": ""
    };

    //Red wine entry
    const redWine1 = {
        "type": "item",
        "wine": "Cabernet Sauvignon",
        "glass": "5.50€",
        "bottle": "35.00",
        "details": "Very meaty with fruit flavors"
    };

    //Red wine entry
    const redWine2 = {
        "type": "item",
        "wine": "Merlot",
        "glass": "3.50",
        "bottle": "28.50",
        "details": "Well rounded, medium bodied"
    };

    //Red wine entry
    const redWine3 = {
        "type": "item",
        "wine": "Pinot Noir",
        "glass": "4.00",
        "bottle": "29.00",
        "details": "Juicy fruit flavours"
    };

    //White wine entry
    const whiteWine1 = {
        "type": "item",
        "wine": "Chardonnay",
        "glass": "5.00",
        "bottle": "35.00",
        "details": "Fruity palate and versatility"
    };

    //White wine entry
    const whiteWine2 = {
        "type": "item",
        "wine": "Sauvignon Blanc",
        "glass": "4.50",
        "bottle": "33.00",
        "details": "Aromatic pale yellow and dry"
    };

    //White wine entry
    const whiteWine3 = {
        "type": "item",
        "wine": "Gewürztraminer",
        "glass": "3.50",
        "bottle": "30.0",
        "details": "Full of character"
    };

    //Putting all table rows together in one array
    const tableRows = [
        groupRedWine,
        redWine1,
        redWine2,
        redWine3,
        groupWhiteWine,
        whiteWine1,
        whiteWine2,
        whiteWine3
    ];

    //Example for Panel- Ui, but will work the same way in iFrame- Ui
    const printessLoader = await import("https://editor.printess.com/v/nightly/printess-editor/loader.js");

    const printessApi = await printessLoader.load({
        token: "[your-shop-token]",
        templateName: "KB-Table-Formfield-Values",
        templateVersion: "published",
        formFields: [
            {
                name: "menuItems",
                value: JSON.stringify(tableRows)   //tables must be serialized json arrays
            }
        ]
    });
```


# Change form field configuration / Changing form field list entries

It is possible to change the complete configuration of one or more form fields. This can be done with the **formFieldProperties** attach parameter. This is an array containing all the form field definitions / properties that should be changed.
The definition for one form field is:

```js
{
    name: string,                       //The form field name
    regExp?: string,                    //A js regex for form field validation
    regExpMessage?: string,             //The validation message in case the validation fails
    info?: string,                      //The form field info text
    maxChars?: number,                  //The maximum number of characters this form field should take
    priceDisplay?: number,              //The price per letter
    pricePrefix?: string,               //A prefix that is displayed in front of the per letter pricing display
    pricePostfix?: string,              //A postfix that is displayed after the per letter pricing display
    hasPerLetterPricing?: boolean,      //The number of used letters is used for pricing.
    isMandatory?: boolean,              //This form field is mandatory and the user has to change its value
    clearOnFocus?: boolean,             //The form field valiue is cleared after receiving the input focus
    list?: formFieldListEntry[]         //In case of list form fields, the list entries
};
```

In case of list form fields, the definition for one list entry looks like this:
```js
type formFieldListEntry = {
  key: string,          //The list entry key (value)
  label?: string,       //The display label
  description?: string, //A short description about this entry
  imageId?: string,     //The image id in case of image list
  tag?: string,         //The tag used for price categories
  meta1?: string,       //Additional free to use property
  meta2?: string,       //Additional free to use property
  meta3?: string,       //Additional free to use property
  meta4?: string,       //Additional free to use property
  disabled?: boolean    //If set to true, this entry will not be displayed
}
```

Inside the list form field configuration these properties are displayed as columns inside the list entry table:

To change the label of a form field named "Fruits" from **Fruits** to **Vegetables** the **formFieldProperties** parameters needs to be configured like this:

```js
formFieldProperties: [
    name: "Fruits",
    label: "Vegetables"
]

```

The following example demonstrates how to set a form field value called "Text" from **Fruits** to **Vegetables** and changes the list entries from fruit types to vegetable types.

```js
<script type="module">
    //Example for Panel- Ui, but will work the same way in iFrame- Ui
    const printessLoader = await import("https://editor.printess.com/v/nightly/printess-editor/loader.js");

    const printessApi = await printessLoader.load({
        token: "[your-shop-token]",
        templateName: "KB-List-Formfield-Entries",
        templateVersion: "published",
        formFields: [
            {
                name: "Text",
                value: "Vegetable"
            },
            {
                name: "fruits",
                value: "Carrot"
            }
        ],
        formFieldProperties: [
        {
            name: "fruits",
            list: [
                {
                    key: "Tomatoe",
                    label: "Tomatoe"
                },
                {
                    key: "Onion",
                    label: "Onion"
                },
                {
                    key: "Cucumber",
                    label: "Cucumber"
                },
                {
                    key: "Cabbage",
                    label: "Cabbage"
                },
                {
                    key: "Carrot",
                    label: "Carrot"
                }
            ]
        }
        ]
    });
</script>
```

Please note, the images used in this example must be already available inside the template. The Images based on the selected list value are selected by hardcoded styles.

# Merging templates

You can merge specific designs into your base template through Attach Parameters, in order to display a pre-configured product based on prior inputs of the user, similar to pre-filling form fields.

In order to achieve this, you need the attach parameter `mergeTemplates`, which accepts an array of objects, where each object is the configuration of a source template and how to apply it to the template that's currently displayed.

As you can see in our example Codepen and the code block below, you can either merge resources by specifying their `templateName` and `documentName` or, in the case of Snippets, their Snippet ID.

You can specify multiple objects in the array and the merges will be performed sequentially. Having too many merge operations in one template will come at a computational cost and may slow down the loading process, so you should not go overboard with them.

```js
const printessApi = await printessLoader.load({
    token: "[your-shop-token]",
    templateName: "card_Master",
    templateVersion: "published",
    // Template merging
    mergeTemplates: [
        {
            "templateName": "card_Cake",
            "documentName": "Cake", // optional, source-document used for merging. If not supplied Primary or first Document is used.
            "templateVersion": "published", // Can be draft or published (default) depending on which version of the document should be used
            // spreadIndex: 0; // optional, specify where in the **target** document the resource should be applied
            // mergeMode: "merge" // other options: "layout-snippet-no-repeat" | "layout-snippet-repeat-all" | "layout-snippet-repeat-inside"
        },
        {
            "templateName": "sid~34997b3a82c9cfbb8e300a12c7790427ee9a02d5~gid",
            // ^ In this case we merge a Snippet by its ID, which you can find in the Account Portal
            "spreadIndex": 1,
            "mergeMode": "layout-snippet-no-repeat",
      },
    ],
});
```

Specifying the `spreadIndex` is vital if you want to merge multiple templates sequentially, which you can see in the example above. Setting spreadIndex to 0 or unsetting it will lead to the layout snippet being merged at the same spread as the card, rendering it invisible underneath.


The spreadIndex functions as a starting point of your merge: starting from the specified spread, the following spreads will be filled until there are none left in either the source or the target.


Note that if your merge target does not have enough spreads to accommodate all your source spreads, the overflowing spreads will be discarded.


# Callbacks

Printess provides you with the possibility of listening to certain events through callbacks, which you can specify as attach parameters as well.

You can find all callbacks in the resource **printess-editor.d.ts**, by searching for `interface printessCallbacks`.

### Basic Callbacks

Here are the most important callbacks, which you will need in most of your integrations:

```html
<body>
  <!-- By giving HTML elements the class "printess-owned", the editor is able to hide them when it is displayed itself and shows them again when it is hidden. -->
  <!-- This way the Editor and surrounding HTML elements won't have to fight through z-indeces or other ugly methods. -->
  <div class="printess-owned">
    <h1> If you can read this, the Editor is hidden </h1>
    <button> Show Editor </button>
  </div>
</body>
<script type="module">
    const printessLoader = await import("https://editor.printess.com/printess-editor/loader.js");

    let savedState = "";

    const onBack = (saveToken, thumbnailUrl) => {
        alert(`Backing up! \nSave Token: \n${saveToken} \nThumbnail \n${thumbnailUrl}`);
        savedState = saveToken;
        if(printessApi) {
            printessApi.ui.hide();
        }
    }

    const onBasket = (saveToken, thumbnailUrl) => {
        alert(`Cast it in the Basket! \nSave Token: \n${saveToken} \nThumbnail \n${thumbnailUrl}`);

        try {
            // Call your backend to send the saveToken to production and close the editor
            ui?.hide()
        } catch (err) {
            alert(err.message)
        }
    }

    const printessApi = await printessLoader.load({
        token: "[your-shop-token]",
        templateName: "Printess-Basic-Callbacks",
        templateVersion: "published",
        backButtonCallback: onBack,
        addToBasketCallback: onBasket,
        saveTemplateCallback: (saveToken, type, thumbnailUrl) => {
          alert(`Better Save than sorry! \nSave Token: \n${saveToken} \nThumbnail \n${thumbnailUrl}\nType \n${type}`);
          savedState = saveToken;
        },
        loadTemplateButtonCallback: () => {
          alert("Fear and Loading in Las Vegas");
          loadSavedState();
        },
    });

    const showButton = document.querySelector("button");
    showButton.addEventListener("click", () => {
        printessApi.api.load(savedState);
        printessApi.ui.show();
    })

    const loadSavedState = () => {
        if (!savedState) {
            alert("Nothing to load...");
            return;
        }
        printessApi.api.load(savedState);
    }
</script>
```



All basic Callbacks utilise SaveTokens - Printess SaveTokens are only **stored for 30 days** by default.


#### Back-Callback

This callback is fired when the user clicks on the **Back** button. It carries a **save-token** in case you want to allow your user to continue their work later. To enable this, just pass the **save-token** instead of the Template name.

`backButtonCallback?: (saveToken: string, thumbnailUrl: string) => void`

#### Basket-Callback

This is fired when the user selects the **Add to Basket** button. It carries a **save-token** which you can pass to the backend API for production or pass to **templateName** for making changes on the saved work.
The basket callback also carries a thumbnail URL for showing off the configured product in your shopping cart.

`addToBasketCallback?: (saveToken: string, thumbnailUrl: string) => void`

#### Save-Callback

This is fired when the user clicks the **Save** button. It carries a **save-token** which you can pass to the backend API for storing. Later you can pass it as **templateName** for continue working on or ordering.
The Save Button is only visible if you activate it under **Buyer View Appearance** -> **Other Settings** -> **Show Save Button**

`saveTemplateCallback?: (saveToken: string, type: "save" | "close", thumbnailUrl: string) => void`

>Depending on your shop system, you might need to store more information than just the saveToken in order to load your saved state at a later time.
>
>The needed information might contain things like:
>- Session or User ID
>- Product name / ID / handle
>- Selected Product Variant
>- Available options for editing

#### Load-Callback

This is fired when the user clicks the **Load** button. The Load Button is only visible if you activate it under **Buyer View Appearance** -> **Other Settings** -> **Show Load Button**

`loadTemplateButtonCallback?: () => void`

Inside this callback you could offer a user to see all of their saved states that you stored in your backend through one of the previous callbacks. They could then choose one to load from the list, which you can do by calling `printessApi.api.load(chosen_save_token)`.

### Advanced Callbacks

Following are some more niche Callbacks you might need in your integration. This list is not exhaustive, if you don't find what you need, visit our resource **printess-editor.d.ts** and search for `interface printessCallbacks` to see all Callbacks that Printess offers.

#### formFieldChanged

The formFieldChangedCallback will be called when a **price relevant** form field changes.

`formFieldChangedCallback = (name: string, value: string, tag: string, label: string, ffLabel: string) => void;`


#### priceChangeCallback

The priceChangeCallback will be called when any price relevant detail of the design changes. This includes form fields, but also extends to other details.

`priceChangeCallback = (infos: iExternalProductPriceInfo) => void`

#### errorCallback

In case an error occurs, the errorCallback will be called, this way you can catch any issues, log them and/or give users a good looking message.
If you encounter a reoccurring error and think it might be an issue with Printess itself, any logging on your side can also help us in routing it out.

`errorCallback?: ((errorName: ErrorName, data?: Record<string, string>) => void) | undefined`

In the example below we force an error to happen by trying to load a non-existent template:

# AI Auth token

If you have created an AI Auth token for granular and authorized control over AI usage, you can use that token as an attach parameter to actually enforce your control.

To do this, you need to use the attach parameter `aiAuthToken`:

``` json
  "aiAuthToken": "YOUR_GENERATED_TOKEN"
```

# Custom Buttons

You can add custom buttons into the Printess editor using the attach parameter `buttons`, an array of `iExternalButton`.
The structure of one such button looks like this:

``` js
iExternalButton: {
    clickCallback: (() => any);
    color: "primary" | "secondary";
    icon?: iconName;
    label: string;
    location: "button-bar" | "image-upload" | "only-image-upload";
    outline: "solid" | "outline";
}
```

As you can see, you can specify a callback, styles according to your theme and also the location of the button.


# Printess Make Data

If you have a Printess Make product and want your customers to skip the setup questions - maybe they already gave you the answers earlier in your process - you can do this easily by using the `makeData?: iMakeData` parameter.

The iMakeData interface contains information that would normally be requested through the setup questions:
``` javascript
export interface iMakeData {
  businessName: string,
  businessType: string,
  valueProposition: string,
  language: string,
  logoUrl: string,
  email: string,
  website: string,
  tel: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  addressLine4: string,
}
```


## Changing the Basket Thumbnail size

If you need a higher resolution thumbnail for an item in the shopping cart, you can change the maximum size with the attach parameters `basketThumbnailMaxHeight: number` and `basketThumbnailMaxWidth: number`.
They both take a number up to 1000.

