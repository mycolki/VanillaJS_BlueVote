const votingOptions = document.querySelectorAll('.votingOption');

function preventBtnClick() {
  for (const option of votingOptions) {
    option.setAttribute('disabled', true);
  }
}

for (const option of votingOptions) {
  option.addEventListener('click', () => {
    option.classList.add('selected');
    setTimeout(() => {
      preventBtnClick();
    })
  });
}

// function submitSelectedVoting() {
//   console.log('dd')
//   option.addEventListener('click', () => {
//     option.classList.add('selected');
//     preventBtnClick();
//   });
// }

// const selectedVotingForm = document.querySelector('.selectedVotingForm');
// selectedVotingForm.addEventListener('submit', () => {
//   console.log('d')
// });

