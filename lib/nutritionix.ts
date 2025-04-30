const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

export async function searchFood(query: string) {
  try {
    const response = await fetch(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NUTRITIONIX_APP_ID!,
          'x-app-key': NUTRITIONIX_API_KEY!,
        },
        body: JSON.stringify({
          query,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }

    const data = await response.json();
    return data.foods;
  } catch (error) {
    console.error('Error searching food:', error);
    throw error;
  }
}
