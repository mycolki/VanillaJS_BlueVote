const $newVotingForm = document.querySelector('.newVotingForm');
const $addOptionBtn = document.querySelector('.addOptionBtn');
const $addOptionMessage = document.querySelector('.addOptionMessage');

function createElementWithClass(tagName, className, type, alt) {
  const $element = document.createElement(tagName);
  $element.classList.add(className);

  if (type) {
    $element.setAttribute('type', type);
  }

  if (alt) {
    $element.setAttribute('alt', alt);
  }

  return $element;
}

$addOptionBtn.addEventListener('click', () => {
  if (document.querySelectorAll('.optionRow').length >= 5) {
    return;
  }

  const $optionRow = createElementWithClass('div', 'optionRow');
  const $option = createElementWithClass('input', 'option', 'text');
  const $removeOptionBtn = createElementWithClass('button', 'removeOptionBtn', 'button', 'remove');

  $option.setAttribute('name', 'options');
  $option.setAttribute('maxlength', '25');
  $removeOptionBtn.textContent = '➖';

  $optionRow.append($option, $removeOptionBtn);
  $newVotingForm.insertBefore($optionRow, $addOptionMessage);
});
