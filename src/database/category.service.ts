
import { BASE_URL } from "../URL/api";
export async function getCategories() {
   const response = await fetch(`${BASE_URL}/category`);
   return response.json();
}







// import { db } from "./db";

// export async function saveCategories(
//   categories: any[]
// ) {

//   try {

//     for (const category of categories) {

//       await db.runAsync(
//         `
//         INSERT OR REPLACE INTO categories (
//           id,
//           name
//         )

//         VALUES (?, ?)
//         `,
//         [
//           category.id,
//           category.name,
//         ]
//       );
//     }

//     console.log(
//       "Categories saved"
//     );

//   } catch (error) {

//     console.log(
//       "SAVE CATEGORIES ERROR:",
//       error
//     );
//   }
// }

// export async function getCategories() {

//   try {

//     const result =
//       await db.getAllAsync(`
//         SELECT * FROM categories
//       `);

//     return result;

//   } catch (error) {

//     console.log(
//       "GET CATEGORIES ERROR:",
//       error
//     );

//     return [];
//   }
// }