import api from "./client";

// Получить мою информацию (GET /finansoid-api/v1/users/me)
export async function getMe() {
  try {
    const { data } = await api.get('/finansoid-api/v1/users/me')
    /*
    Example response:
    {
      success: true,
      user: {
        id: 'some_uuid',
        username: 'Oleg44_rus',
        userpic_url: 'https://photo.com/oleg_avatar.png',
      }
    }
    */
    return data
  } catch (err) {
    console.error('getCategories() failed:', err)
    return { success: false }
  }
}
