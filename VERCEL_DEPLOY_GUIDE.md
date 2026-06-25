# 🚀 말자람터 언어심리연구소 공식 홈페이지 배포 가이드 (Vercel)

비개발자 센터 운영진도 클릭 몇 번으로 전 세계에 홈페이지를 안전하게 런칭할 수 있는 가이드입니다.

---

## 1단계: 깃허브(GitHub)에 코드 업로드

1. **GitHub 계정 생성 및 새 리포지토리 만들기**
   - [GitHub.com](https://github.com)에 로그인하신 뒤 [New Repository]를 만들어 `maljarumter-web` 등의 이름을 붙입니다. (Private 비공개 권장)
2. **코드 커밋 및 푸시**
   - 내 PC에 있는 코드를 깃허브 리포지토리로 올립니다.
   - 이때 `.env.local` 파일은 자동으로 `.gitignore`에 의해 제외되므로 **비밀번호나 API 키가 인터넷에 유출될 위험이 100% 없습니다.**

---

## 2단계: Vercel과 Supabase 연동하기

1. **Vercel 회원가입**
   - [Vercel.com](https://vercel.com)에 접속하여 **[Continue with GitHub]**를 눌러 깃허브 계정으로 연동 가입합니다.
2. **새 프로젝트 임포트 (Add New Project)**
   - 대시보드 우측 상단의 **[Add New...] -> [Project]**를 클릭합니다.
   - 방금 깃허브에 올린 `maljarumter-web` 리포지토리 옆의 **[Import]** 버튼을 누르세요!
3. **★ 가장 중요한 단계: 환경변수(Environment Variables) 입력**
   - 배포 설정 화면 하단의 **[Environment Variables]** 탭을 펼치고 아래 값들을 정확히 입력합니다. (미입력 시 DB 연결이 안 되어 더미 데이터만 나옵니다)

   | NAME (키 이름) | VALUE (넣으실 실제 값) |
   | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL (예: `https://abcd...supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase 대시보드 API 설정에 있는 `anon` / `publishable` 키 |
   | `NEXT_PUBLIC_SITE_URL` | 연결하실 실제 도메인 주소 (예: `https://maljarumter.com`) |
   | `NOTIFICATION_PROVIDER` | 초기는 반드시 **`mock`**으로 입력 (문자 테스트 준비되시면 `solapi`로 변경) |

4. **[Deploy] 버튼 클릭!**
   - 약 1~2분 정도 🚀 초록색 런칭 애니메이션이 돌고 나면 **[Congratulations!]** 축하 화면과 함께 공식 도메인이 생성됩니다!

---

## 3단계: 실제 문자(SMS) 알림 서비스 정식 오픈하기

홈페이지 운영이 안정화되고 학부모님들께 실제 문자를 쏘고 싶으실 때만 진행하세요.

1. [Solapi.com](https://solapi.com) (구 CoolSMS)에 회원가입 하시고 발신번호 1개를 사전 등록합니다.
2. 소액(5,000원 등) 충전 후 API Key와 API Secret 키를 발급받습니다.
3. Vercel 대시보드 -> 내 프로젝트 -> **[Settings] -> [Environment Variables]**에 가셔서 아래 4개 값을 수정/추가합니다:
   - `NOTIFICATION_PROVIDER` : **`solapi`**
   - `SOLAPI_API_KEY` : 발급받은 API 키
   - `SOLAPI_API_SECRET` : 발급받은 시크릿 키
   - `SOLAPI_SENDER_NUMBER` : 등록하신 우리 센터 전화번호 (숫자만, 예: `0212345678`)
4. 상단의 **[Redeploy]** (재배포) 버튼을 한 번 눌러주시면 그 순간부터 상담 예약 확정 시 학부모님의 핸드폰으로 알림 문자가 발송됩니다! 🌻
