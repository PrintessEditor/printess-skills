---
name: "createconnect-printess-backend"
description: This Skill allows to conntect to the backend of the printess web2print software to query the printess template repository, create pdf, png or jpg print outputs.
license: Free to use with printess account
---
Printess provides an extensive backend API which is used purly server side e.g. with Node.JS by  Printess customers to:
- retrieve and manage the repository directories printess uses to store templates
- create Orders for production files from templates with or without data and user personalized documents
- manage templates users and settings

Each backend function will need the service-token for authorization as Bearer in the request header.
Store the Service Token in a .env file and **never** hard code it into any function.


Definitions:
Save Token a aprox 70 character long hash identifying a cutomer personalized/cutomized template. This Save token is returned by the Printess 'Buyer-Side' editor callback when the customer presses the 'Add to Basket' button. This buyer side editor is used in the shop system/on or the web page to allow a customer to personalise/customize a template.  The save token can be used everywhere where a template name can be used in the api. Save tokens and their connected resources have a default lifetime of 30 days which can get extended with the api /savetoken/lifetime/extend.

Templates have unique template name within one repository independend of the folder they are organized in. Templates have two versions a always existing draft version and if exting a published version which is normally used in shop environments as the live version.

See a full OpenAI definition of the printess API here:
https://api.printess.com/swagger/public/swagger.json


## Create production orders
Orders are ordered production files from either a saveToken or a template. As this can be a long running process after using /production/produce the caller will recive an jobID back to query the progress and state by using /production/status/get (Note: if the backend can recive callbacks this polling method to get the status should be replaced by a callback url provided in the produce call which get called by Printess on every state change - the callback will receive the same payload then the status/get call). Once the state object returned by a status/get call has its isFinalStatus property set to true the job is processed. It either indicates successful process with isSuccess=true or it contains errorDetails.

Please see the following js code example for getting a pdf from a saveToken (polling status method). Call this example with producePdf(YOUR_TOKEN, templateNameOrSaveToken).

``` js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function postJson(url, token, model) {
  return await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(model)
  });
}

async function sendToProduction(token, templateNameOrSaveToken) {
  const model = {
    "templateName": templateNameOrSaveToken,
    "origin": "YOUR PRODUCTION SYSTEM NAME",
    "outputSettings": {
      "dpi": 300
    }
  };
  const response = await postJson("https://api.printess.com/production/produce", token, model);

  return response;
}

async function getStatus(token, jobId) {
  const model = { "jobId": jobId };
  const response = await postJson("https://api.printess.com/production/status/get", token, model);

  if (!response.ok) {
    throw new Error(`Cannot retrieve status: ${response.statusText} (statusCode=${response.status})`);
  }

  const apiStatus = await response.json();

  return apiStatus;
}

async function producePdf(token, templateNameOrSaveToken) {
  const produceResponse = await sendToProduction(token, templateNameOrSaveToken);

  if (!produceResponse.ok) {
    const errorMessage = await produceResponse.text();
    throw new Error("Cannot produce pdf error=" + errorMessage + ", statusCode=" + produceResponse.status);
  }

  const produceJson = await produceResponse.json();
  const jobId = produceJson.jobId;
  const statusModel = { "jobId": jobId };

  let isFinished = false;
  let status;

  do {
    status = await getStatus(token, jobId);
    isFinished = status.isFinalStatus;

    if (!isFinished) {
      await sleep(1000);
    }
  } while (!isFinished);

  if (status.isSuccess) {
    const pdfs = Object.keys(status.result.r).map(key => ({ document: key, url: status.result.r[key] }));

    for (const document of pdfs) {
      window.open(document.url, "_blank");
    }

    // this handles picture output (png, jpg, tif) if you set output type
    if (status.result.p) {
      for (let i = 0; i < status.result.p.length; i++) {
        const distributionFile = status.result.p[i];
        window.open(distributionFile.u, "_blank");
      }
    }

  } else {
    alert("Cannot render pdf: " + status.errorDetails);
  }
}
```

The produce-callback
While the roundtrip described above will work for a prototype phase, it is advised to use the callbackUrl in the produce-call. When the production job succeeds, the supplied callbackUrl is used with essentially the same body that would be received by the /production/status/get call:

``` js
{
  jobId: string,
  orderId:  string,
  userId: string,
  templateName: string,
  externalOrderId: string,
  result: {
    s: { // staticstics
    },
    r: { // distributor results
    },
    d: { // final output files
    },
    p: [DistributionFile],
    meta: string,
    zip: string, // zip-file uri
    ff: // form-fields-file,
    ps: // pages-file
  },
  isFailure: boolean,
  failureDetails: string
}
```
To assign the order id used by your shop or ecommerce sytem use the externalOrderId-field with an unique id.
``` js
async function sendAsyncToProduction(token, templateNameOrSaveToken, yourInternalOrderId) {
  const model = {
    "templateName": templateNameOrSaveToken,
    "externalOrderId": yourInternalOrderId,
    "callbackUrl": "https://your.site.example.com/callback_route", // change this!
    "origin": "YOUR PRODUCTION SYSTEM NAME",
    "outputSettings": {
      "dpi": 300
    }
  };
  const response = await postJson("https://api.printess.com/production/produce", token, model);
  return response;
}
```

With a simple express-based backend we can wait for the callback to resolve:
``` js
// [...]
app.post("/callback_route", (req, res) => {
    // Extract your order id
    const yourInternalOrderId = req.body.externalOrderId;
    // Extract PDF URLs
    const pdfUrls = Object.values(req.body.result.r);
    // update your orders accordingly
    // [...]
});
```
But you can also modify the meta-key of the /production/produce to contain arbitrary information, in form of parameters.

## Rendering templates using data, or injecting form field values at production time

In a produce call additional optional variable info can get submitted:

``` json
"vdp": {
        "form": {
          "additionalProp1": "string",
          "additionalProp2": "string",
          "additionalProp3": "string"
        },
        "records": [
          {
            "additionalProp1": "string",
            "additionalProp2": "string",
            "additionalProp3": "string"
          }
        ],
        "templateStyle": "string"
      }
```
In the form section so called 'late binding' form field values can get injected into a template/saveToken e.g. the `orderID` from the Shop system needs to be printed/put into a barcode of the template. This `orderID` only exists after editing and checkout.
but if the document contains a Form Field receiving this data it can still be on the final print piece by supplieing its name and value here.
Note Form Fileds can contain String, Number and Table Data (In the form of an array of Objects).

Within a produce call you can also refrence data (which in the template is adressed diffrently) in the records section. Records are organized in an array (rows) containing column names and values (both strings). The template/saveToken will output for each element of the array. The output PDF will contain all records in the order of their appearance in the array.

Both Form Fileds (global across all records) and records can get used in parallel.


## Other Backend Examples
Following you’ll find some more niche use cases of the backend API that have come up from real world applications of our customers. They might be helpful to you as well or inspire you to take your Printess integration to the next level.

Load templates of one specific directory
Sometimes you might want to get a list of tmeplates, for example as a shortlist for a user to select the one that they need. You wouldn’t want them to choose from all your templates, as this can become an overwhelming selection - just as it would be for yourself to maintain. Since you probably already have your templates grouped in different directories, you can easily use this to your advantage:

You can load a list of templates through the templates/user/load endpoint. This endpoint accepts several different parameters to filter your result:
``` json
{
  "userId": "string",
  "directoryId": 0,
  "templateName": "string",
  "type": "string",
  "publishedOnly": true
}
```
