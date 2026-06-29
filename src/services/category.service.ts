import * as SecureStore from "expo-secure-store";
import { api } from "../api/client";

export async function getCategories() {
   try{

   const token = await SecureStore.getItemAsync("token");
   console.log("TOKEN =", token);
   const response = await api.get("/category");
   return response.data?.data??[];
   }catch (error){
      console.log("Category API ERROR:", error);
      return [];
   }
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