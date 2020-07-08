# videocall-stress-test-for-rm

## 목적

개발로컬에서 15인, 30인 등 다수의 화상회의 참석을 자동화하여 개발의 효율성을 높이기 위함.

## 시나리오

1. 개발로컬에서 st서버를 바라보게 하고 프론트엔드를 띄움 (webpack-dev)
2. 몇번방에 들어갔는지를 확인하여 videocall-stress-test-for-rm를 실행시킬때 조건을 입력함

- .env 파일

```SHELL
NODE_ENV=development # default. 지워도 됨
TARGET_URL=https://st.remotemeeting.com # 접속할 포트
ID=shmoon@rspt.com # 자신의 아이디 입력
PW=xxxxxxxx # 자신의 아이디 입력
NUMBER_OF_PARTICIPATE=15 # 반복해서 참여할 인원
```

- Command
```SHELL
$ yarn start -TARGET_URL=https://st.remotemeeting.com -ID=shmoon@rspt.com -PW=xxxxxxxx -NUMBER_OF_PARTICIPATE=15
```

1. 