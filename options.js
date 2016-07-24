// Saves options to chrome.storage
function saveOptions() {
  let content = $('#options-content input:checked').toArray().map(input => input.value);
  chrome.storage.sync.set({
    blockContent: content,
  }, function() {
    // Update status to let user know options were saved.
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    blockContent: ['Trump'],
  }, function(items) {
    // restore which boxes are checked:
    $('#options-content input').toArray().forEach(input => {
      // document.getElementById("checkbox").checked = true;
      if (items.blockContent.includes(input.value)) {
        input.checked = true;
        items.blockContent.splice(items.blockContent.indexOf(input.value), 1); // so only custom labels are left
      }
    });
    items.blockContent.forEach(customCategory => {
      // regenerate custom categories
      let label = $(`<label>${customCategory}</label>`).addClass('outer-label');
      let category = $(`<input class="category" type="checkbox" value='${customCategory}'>`);
      label.prepend(category);
      label.prepend($('<div class="dropdown-icon"></div>'));
      category[0].checked = true;
      $('#options-content').append(label);
    });
  });
}

function createCategory(string) {
  stringId = string.replace(" ", "-");
  let label = $(`<label>${string}</label>`).addClass('outer-label').attr('id', `${stringId}`);
  // let category = $(`<input class="category" type="checkbox" value='${string}'>`);
  let category = $('<input/>', {
    "class": "category",
    type: "checkbox",
    value: `${stringId}`
  });
  label.prepend(category);
  label.prepend($('<div class="dropdown-icon"></div>'));

  // let contentItemLabel = $(`<label class="content-item">${string}</label>`)
  // let contentItem = $('<input/>', {
  //   "class": "content-item",
  //   type: "checkbox",
  //   value: `${string}`,
  //   id: `${string}-item`
  // });

  // label.append(contentItemLabel.prepend(contentItem))

  let contentItemForm = $('<form/>', {
    "class": `${stringId} item-form`,
    id: `${stringId}-form`
  });

  let contentFormLabel = $(`<label class="outer-label">Custom filter</label>`);

  let contentItemInput = $('<input/>', {
    "class": `custom-content ${stringId}`,
    id: `${stringId}-input`,
    type: 'text',
    placeholder: "Enter text",
    vale: "",
  })

  let contentItemSubmit = $('<input/>', {
    type: 'submit',
    class: 'hidden-submit'
  });

  $(contentItemForm).submit((e) => {
    e.preventDefault();
    createItem(contentItemForm);
  })

  contentFormLabel.append(contentItemInput);
  contentItemForm.append(contentFormLabel);
  contentItemForm.append(contentItemSubmit);
  label.append(contentItemForm);

  category[0].checked = true;
  $('#options-content').append(label);
  $('.custom-category').val(''); // clear input field
}

function createItem(form) {
  const formClass = $(form).attr('class').split(' ')[0]
  const parent = $(`#${formClass}`);
  const input = $(`#${formClass}-input`)

  const label = $(`<label class="content-label ${input.val()}">${input.val()}</label>`);
  const newItem = $('<input/>', {
    "class": "content-item",
    type: "checkbox",
    value: `${input.val()}`,
    checked: true
  });

  $(parent).append(label.prepend(newItem));
}

$(document).ready(() => {
  restoreOptions();
  let saveButton = document.getElementById('save-button');
  if (saveButton) {
    saveButton.addEventListener('click',
        saveOptions);
  }

  let customCategorySubmit = document.getElementById('custom-category-form');
  if (customCategorySubmit) {
    customCategorySubmit.addEventListener('submit', e => {
      e.preventDefault();
      createCategory($('.custom-category').val()); // pass in text field value
    });
  }

  // let sexualtAssaultSubmit = document.getElementById('sexual-assault-form');
  // if (sexualtAssaultSubmit) {
  //   sexualtAssaultSubmit.addEventListener('submit', e => {
  //     e.preventDefault();
  //     createItem($('#sexual-assault-input').val());
  //   })
  // }

  let itemForms = $('.item-form');
  console.log(itemForms);
  if (itemForms) {
    itemForms.toArray().forEach((form) => {
      $(form).submit((e) => {
        e.preventDefault();
        createItem(form);
      });
    });
  }

  // const sexualAssault = $('.category.sexual-assault')[0];
  // const trump = $('.category.trump')[0];

  // const contentItemSubmit = $('<form class="content-form"><label class="content-item-label">Custom item: <input type="text" placeholder="Enter text" class="custom-item" value=""></label><input type="submit" class="hidden-submit"/></form>')
  // $('.outer-label').append(contentItemSubmit);
  // $('.content-form').toArray.forEach(form => {
  //   form.addEventListener('submit', e => {
  //     e.preventDefault();
  //
  //   });
  // })

  // $(sexualAssault).change(() => {
  //   let categoryParent = $('.category.sexual-assault')[0].parentNode
  //   $(categoryParent).children('.content-item').toArray().forEach((input) => {
  //     if (sexualAssault.checked) {
  //       input.checked = true;
  //     } else {
  //       input.checked = false;
  //     }
  //   })
  // });
  //
  // $(trump).change(() => {
  //   let categoryParent = $('.category.trump')[0].parentNode
  //   $(categoryParent).children('.content-item').toArray().forEach((input) => {
  //     if (trump.checked) {
  //       input.checked = true;
  //     } else {
  //       input.checked = false;
  //     }
  //   })
  // });


});
