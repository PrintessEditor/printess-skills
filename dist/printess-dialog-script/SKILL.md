---
name: "create-printess-dialogue"
description: This is how to create a custom Dialog for the Printess Web-to-print software.
license: Free to use with printess account
---

Just create the script with comments for copy and paste.

You need to create a javascript which will be executed by the host. It can read and write FormFields which can contain data like strings, numbers or even tables in the form of a plain JS-Array containing objects with properties named like the column names of the table. like:

``` json
[
  {
  name: "John Doe",
  address: "1 Sample Street"
  },
  {
  name: "Peter Mustermann",
  address: "12 East Way"
  }
]
```

All Form Fields will be passed via the `form` object. Reading value is like:
```js
  const value = form.name
```
Setting values works via the printess js-api:

```js
  api.setFormFieldValue("name", "Peter Berger")
```

The scripting host provides you with an `await api.openDialog()` method which returns a div where you can render your HTML in.
Please use lit-html template syntax for rendering. lit-html is just available in the script.

Here is an example implementation of a dialog script:

```js
function editTable() {
  let container;
  let table = form.table;
  async function openDialog() {
	 container = await api.openDialog({
			callback: () => save(),
			headline: "Please select size"
	});
	  update();
  }
	function save() {
		api.setFormFieldValue("table", table);
	}
  function update() {
    render(myTemplate(), container);
  }

  const myTemplate = () => html`
			<style>
				.dialog {
					width: 400px;
					height: 500px;
				}
	       .inputs {
					display: grid;
					grid-template-columns: 40px 120px 120px;
					width: min-content;
					margin: 10px auto;
					gap: 10px;
				}
			</style>
			<div class="dialog">
		     <div class="inputs">
					<h4></h4>
					<h4></h4>
					<h5>Price</h5>
				</div>
				${table.map(r => html`
					<div class="inputs">
						${r.canHide ? html`
							<label class="bc-checkbox" style="margin: 0;">
					      <input type="checkbox" .checked=${r.show} @click=${(e) => r.show = e.target.checked} />
					     </label>
						`: html`
                 <div></div>
						`}
						<h4>${r.name}</h4>
						<input class="inp bc-control" type="text" value="${r.price}"  @input=${(ev) => r.price = ev.target.value} />
					</div>
				`)}
       </div>
		`;
  openDialog();
}
```
