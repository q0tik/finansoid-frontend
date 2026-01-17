import Cookies from 'js-cookie'

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwicHJvZmlsZV9pZHMiOlsiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIl0sImV4cGlyZXNfYXQiOjE4NjYwNzcxODR9.UFjSwZNY3-BudF7aG88TrL7wz8yo_c3v8XIWs7uSCqM"
const REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiZXhwaXJlc19hdCI6MTk2NjA3NzE4M30.VKKSVQHojp_-m7ZUqCwmSVBqy01U1flxJt6zegekO38"

export const setupHardcodedTokens = () => {
  // Устанавливаем куки. 
  // expires: 7 — кука будет жить 7 дней.
  // sameSite: 'strict' — для безопасности.
  Cookies.set('auth_token', AUTH_TOKEN, { expires: 1000, sameSite: 'lax' });
  Cookies.set('refresh_token', REFRESH_TOKEN, { expires: 2000, sameSite: 'lax' });
  
  console.log('Tokens have been hardcoded into cookies');
}