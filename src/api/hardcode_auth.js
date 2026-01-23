import Cookies from 'js-cookie'

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwicHJvZmlsZV9pZHMiOlsiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiMDY5NjUxMWQtNWRkMS03MWJlLTgwMDAtYTQ1Y2UzNzM1YjQ2Il0sImV4cGlyZXNfYXQiOjE4Njg4OTkxOTYsInBlcm1pc3Npb25zIjpbXX0.4EqyFjDr4k7aoqjMsNfhRHkjnNZUkDq-YYgEQ3icxJA"
const REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiZXhwaXJlc19hdCI6MTk2ODg5OTE5NX0.A8YMMev0-sdxyQPYs0SQc6psh1GJIbQSNxoIRB6o4wM"

export const setupHardcodedTokens = () => {
  // Устанавливаем куки. 
  // expires: 7 — кука будет жить 7 дней.
  // sameSite: 'strict' — для безопасности.
  Cookies.set('auth_token', AUTH_TOKEN, { expires: 1000, sameSite: 'lax' });
  Cookies.set('refresh_token', REFRESH_TOKEN, { expires: 2000, sameSite: 'lax' });
  
  console.log('Tokens have been hardcoded into cookies');
}