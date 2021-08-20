const votingOptionBtns = document.querySelectorAll('.votingOptionBtn');

function preventBtnClick() {
  for (const option of votingOptionBtns) {
    option.setAttribute('disabled', true);
  }
}

for (const option of votingOptionBtns) {
  option.addEventListener('click', () => {
    option.classList.add('selected');

    setTimeout(() => preventBtnClick());
  });
}
