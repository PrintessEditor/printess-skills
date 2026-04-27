# Price Display
The price display feature allows to show important information on a product including price, product name, legal notice as well as the product information via an info icon button. Reduced or special-offer prices are also possible to display.

>**Pro Tip:** A working price display code example can be created in every template by using the **Generate Embed Code** function in the editor for every template.

## Simple Approach

If you have price relevant form fields set up in your template and are using the Printess price display, you probably want to update the displayed price whenever a price relevant form field changes.

In order to achieve this, you will need at a callback and an API call.
There are two callbacks available to notofy you, when a price relevant form field has changed, `formFieldChangedCallback` and `priceChangeCallback`.


> **Important** You need to update your price in the `priceChangeCallback` using `refreshPriceDisplay()`, otherwise it will not be displayed correctly.


`formFieldChangedCallback` will trigger, when a price-relevant form field changes and return the form field that has actually changed and the new value.
This callback will not be triggered when a price-relevant Snippet changes!
It's the easiest way to access the data that has changed without having to traverse an object looking for the new values.

`priceChangeCallback` will trigger whenever anything price-related changes, which can include Snippets.
It comes with **all** price relevant settings, no matter what actually changed to trigger it.
Theroretically this is the only callback you need, but if you want to pinpoint the actual change, it can be easier to use `formFieldChangedCallback` as well!

One or both of these callbacks and the price info from your shop system give you all the information you need in order to recalculate the price.

Once you know the new price, you can call `api.ui.refreshPriceDisplay()` inside the `priceChangeCallback` with your data:

`refreshPriceDisplay()` needs an `iExternalPriceDisplay` as a parameter:

``` js
/**
 * Structure expected when calling set price information
 */
export interface iExternalPriceDisplay {
  price: string,
  oldPrice?: string
  legalNotice?: string,
  /**
   *  can be dependend on form fields
   */
  productName?: string
  /**
   *  will be displayed via info icon in an iframe.
   */
  infoUrl?: string
}
```

Here is a simple code example for the whole process:

```js
  /*
  ** Your available product variants
  ** Hard coded for this example, in a real application this data most likely comes from your shop system.
  */
  const productVariants = [
    {
        productOptions: [
            {
                name: "Material",
                value: "Acrylic glass"
            },
            {
                name: "Size",
                value: "15 cm x 10 cm"
            }
        ],
        price: 10.99
    },
    {
        productOptions: [
            {
                name: "Material",
                value: "Acrylic glass"
            },
            {
                name: "Size",
                value: "21 cm x 14 cm"
            }
        ],
        price: 11.99
    },
    {
        productOptions: [
            {
                name: "Material",
                value: "Acrylic glass"
            },
            {
                name: "Size",
                value: "30 cm x 20 cm"
            }
        ],
        price: 12.99
    },
    {
        productOptions: [
            {
                name: "Material",
                value: "Acrylic glass"
            },
            {
                name: "Size",
                value: "42 cm x 28 cm"
            }
        ],
        price: 13.99
    },
    {
        productOptions: [
            {
                name: "Material",
                value: "Metal sheet"
            },
            {
                name: "Size",
                value: "15 cm x 10 cm"
            }
        ],
        price: 20.99
    },
    {
        productOptions: [
            {
                name: "Material",
                value: "Metal sheet"
            },
            {
                name: "Size",
                value: "21 cm x 14 cm"
            }
        ],
        price: 21.99
    },
    {
        productOptions: [
            {
                name: "Material",
                value: "Metal sheet"
            },
            {
                name: "Size",
                value: "30 cm x 20 cm"
            }
        ],
        price: 22.99
    },
    {
        productOptions: [
            {
                name: "Material",
                value: "Metal sheet"
            },
            {
                name: "Size",
                value: "42 cm x 28 cm"
            }
        ],
        price: 23.99
    }
];


//Method to retrieve one product variant by a given set of settings
function getVariant(productOptions) {
    let variants = productVariants;
    for (const optionName in productOptions) {
        variants = variants.filter((x) => {
            return typeof x.productOptions.find((y) => {
                return y.name === optionName && y.value === productOptions[optionName];
            }) !== "undefined";
        });
    }
    if (variants.length > 0) {
        return variants[0];
    }
    return null;
}

//The current product configuration on your product page
const currentProductConfiguration = {
    Material: "Acrylic glass",
    Size: "30 cm x 20 cm"
};

const initialFormFieldValues = [];

for(const productOption in currentProductConfiguration) {
  initialFormFieldValues.push({
    name: productOption,
    value: currentProductConfiguration[productOption]
  });
}

// On FF change, define the currently selected state accordingly
const onFormFieldChange = (name, value, tag, label, ffLabel) => {
  if(typeof currentProductConfiguration[name] !== "undefined") {
    currentProductConfiguration[name] = value;
  } else if (typeof currentProductConfiguration[ffLabel] !== "undefined") {
    currentProductConfiguration[ffLabel] = label;
  }
}

// When the price changes, recalculate the price and tell Printess to update its UI
const onPriceChange = (priceInfo) => {
  const variant = getVariant(currentProductConfiguration);

  apiContainer.ui.refreshPriceDisplay({
    snippetPrices: [],
    priceCategories: {},
    price: variant ? variant.price + "€" : 0.00,
    productName: "My product",
    legalNotice: "Taxes & shipping included",
    infoUrl: ""
  });
}

let apiContainer = null;

async function init() {
    const printessLoader = await import('https://editor.printess.com/printess-editor/loader.js');

    const params = {
        token: '[your-shop-token]',
        translationKey: 'de-DE',
        templateName: 'FormFieldsAndPricingExample',
        templateVersion: 'draft', // remove in production! => published
        formFields: initialFormFieldValues,
        priceChangeCallback: (priceInfo) => onPriceChange(priceInfo),
        formFieldChangedCallback: (name, value, tag, label, ffLabel) => onFormFieldChange(name, value, tag, label, ffLabel)
    };

    apiContainer = await printessLoader.load(params);
}

init();
```



## Detailed Approach with Price Category Labels
There are multiple ways to setup price categories or price tags in the editor. Group and layout snippets can have price categories from 1 to 5. Documents can have a named price category and form-fields different price-tags.

When creating layout snippets or stickers go to the "Snippet Export" section. Here one can choose a price category between one and five. These categories will be used to allocate a price label via the **snippetPriceCategoryLabels** attach parameter. Labels are displayed as a badge on each categorized snippet.


Form-field price labels can be set for select-list, image-list and color-list form-fields. It is important to mark them as **Price Relevant** to see results. Price-tags can be set in the column **tag (price-category)**. Same like for snippets you need to set the respective labels in the attach parameters. For form-fields and documents it is the **priceCategoryLabels**. One can give any random named tag to the list items. To see a price label in the buyer side, the tag needs to match a key in the priceCategoryLabels attach parameter.


## Code Setup
In the attach parameters one can add the customized labels for the different categories and price tags set in the editor. Also the priceChangeCallback needs to be added to handle price changes and to update the price display.

### Snippet Price Category Labels
As mentioned snippets have a price category from 1 to 5. In the same order from one to five one needs to add an array of strings for the respective categories as follows:

``` js
/* Labels displayed at stickers which have a price categorie-number set */
snippetPriceCategoryLabels: ["+ 1.50 €", "+ 2.50 €", "+ 3.50 € ", "+ 4.50 €", "+ 5.50 €"]
```

Hereby, the labels are just an example, where snippets with category 1 would get a price badge of "+ 1.50 €" and snippets with category 5 a price badge of "+ 5.50 €".

### Price Category Labels

Form-field labels will be added via the priceCategoryLabels attach parameter, which is of type **Record<string, string>**. In the following example, if an item from a select list has the tag "mug-back" then it will receive a badge with the label "+ 2.10 €" on it.

``` js
/* Labels displayed at form-fields which have a price tag set */
priceCategoryLabels: {
  "mug-front": "+ 2.10 €",
  "mug-back": "+ 2.10 €"
}
```

### Price Change Callback

After setting up the editor and code and then choosing a snippet or changing a price relevant form-field in the buyer side, a priceChangeCallback will be fired. It returns the parameter **priceInfo** which has all the relevant information one needs for calculating the new price displayed beside the basket button.

If now for example the two-sided mug variant was selected from the list, a priceChangeCallback will be thrown and the following priceInfo will be returned:

``` js
{
  priceCategories: ["mug-back"],
  priceRelevantFormFields: {
    MugVariants: {
      tag: "mug-back",
      value: "two-sided"
    }
  },
  snippetPriceCategories: [
    {
      priceCategory: 2,
      amount: 1
    },
    {
      priceCategory: 4,
      amount: 1
    }
  ],
  testModeEnabled: false
}
```

Whereas the priceCategories contain an array of tags that were selected via the form-field lists. The priceRelevantFormFields store information about selected items from price-relevant form-field lists with its value and tag (price-category). And the snippetPriceCategories return the number of times snippets of each price category were used.

The above information can be used to calculate and display a new price to the user. To do so, an object with the new price information has to be put as a parameter when calling the **uiHelper.refreshPriceDisplay** function, which updates the price display in the buyer side.

``` js
{
    price: "11.90 €*",
    legalNotice: "*Inkl. VAT plus shipping",
    productName: "Coffee Mug",
    oldPrice: "14.60 €",
    infoUrl: "https://product-info.com"
}
```

Overall, the **priceChangeCallback** could look as follows in the iframe callback:

``` js
/* **************************** */
/* listen to printess callbacks */
/* **************************** */
window.addEventListener("message", () => {
    switch (event.data.cmd) {
        case "back":
            // Back to catalog. Data:  event.data.token
            break;
        case "basket":
            // Proceed to checkout. Data: event.data.token + event.data.thumbnailUrl
            break;

        case "priceChanged":

            /*
            ** set price based on priceInfo **
            ** Prices for snippets and price categories
            ** need to come from your shop
            ** not used parameters can be left out
            */
            const sampleData = {
                "snippetPrices": [
                    1.5,
                    2.5,
                    3.5,
                    4.5,
                    5.5
                ],
                "priceCategories": {
                    "mug-front": 2.1,
                    "mug-back": 2.1,
                    "t-shirt-front": 3.3,
                    "t-shirt-back": 3.3,
                    "t-shirt-sleave-left": 1.2,
                    "t-shirt-sleave-right": 1.2,
                    "inside": 0.64,
                    "back-side-a4": 1,
                    "back-side-a3": 2
                },
                "basePrice": 1,
                "oldPrice": 0,
                "legalNotice": "Inkl. VAT plus shipping",
                "infoUrl": "https://editor.printess.com/v/nightly/printess-editor/product-overview-sample.html",
                "priceTestModeEnabled": false
            };

            // ** calculate snippet prices
            const snippetPrice = event.data.priceInfo.snippetPriceCategories.map(pc => (sampleData.snippetPrices[pc.priceCategory] || 0) * pc.amount).reduce((p, c) => p + c, 0)

            // ** calculate price categories
            const categoriesPrice = event.data.priceInfo.priceCategories.map(dc => (sampleData.priceCategories[dc] || 0)).reduce((p, c) => p + c, 0);

            // ** get base Price
            const basePrice = sampleData.basePrice;

            const r = {
                price: (sampleData.basePrice + categoriesPrice + snippetPrice).toFixed(2) + "€*",
                legalNotice: sampleData.legalNotice,
                productName:  event.data.priceInfo.priceCategories.indexOf("expensive") >= 0 ? "Expensive Product" : "",
                oldPrice: sampleData.oldPrice > 0 ? sampleData.oldPrice.toFixed(2) + "€" : "",
                infoUrl: sampleData.infoUrl
            }
            //  THIS WILL SET THE PRICE AND INFO DISPLAY
            // ** Set price display in printess
            iframe.contentWindow.postMessage({
                cmd: "refreshPriceDisplay", priceDisplay: r
            }, "*");
            break;
      }
    });

```

>**Legal Notice:** The `legalNotice` parameter supports markdown syntax for links. So you can insert links to your legal or shipping site if you want. Just use `[Link Title](https://www.printess.com)`


## Summary
To conclude, there are three steps to take when setting up a price display. You need the attach parameters ["priceChangeCallback", "snippetPriceCategoryLabels", "priceCategoryLabel"] - labels depend on your requirements. Next you need to setup price categories and / or price tags for your templates in the designer. And you need to handle the data and call the uiHelper.refreshPriceDisplay within the priceChangeCallback to update the final price displayed beside the basket button.

