const VALIDATION = {
  EMAIL_PW: {
    message: 'email 과 password를 입력해주세요'
  },
  EXIST_EMAIL: {
    message: '이미 가입되어 있는 email입니다'
  },
  NOT_EQUAL_PW: {
    message: '비밀번호와 확인용 비밀번호가 일치하지 않습니다'
  },
  FILL_ALL_BLANKS: {
    message: '빈칸을 모두 입력하고 투표만들기 버튼을 눌러주세요'
  },
  FILL_OPTION_BLANKS: {
    message: '비어있는 선택지가 없도록 모두 입력해주세요'
  },
  INPUT_BY_CONDITION: '항목을 조건에 맞게 다시 입력해주세요',
  MALFORMED_INFO: '형식이 잘못 되었습니다. 다시 입력해주세요',
  REDIRECT_NOT_LOGGED_IN_USER: '로그인되지 않은 사용자입니다. 로그인페이지로 이동합니다',
};

const VOTING_COMMENT = {
  FIRST_VOTE: '가슴에 손을 얹고 솔직하게 투표해주시기 바랍니다',
  RE_VOTE: '이미 참여한 투표는 재투표 할 수 없습니다',
};

const FORMS = {
  TITLE: '투표 주제',
  EXPIRED_AT: '투표 마감시간',
  OPTIONS: '선택지',
};

module.exports = {
  VALIDATION,
  VOTING_COMMENT,
  FORMS,
};
