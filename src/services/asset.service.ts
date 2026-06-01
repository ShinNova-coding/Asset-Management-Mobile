import { api } from "../api/client";
export async function getAssets() {
   const response = await api.get("/asset");
   return response.data.data?.data ?? [];
}

export async function getAssetById(id: string) {
  const response = await api.get(`/assets/${id}`);
  return response.data.data;
}

export async function getAssignedAssets(employeeId: string) {
   const response = await api.get(`/assignment/${employeeId}/asset`);
   return response.data.data;
}






// import { db } from "./db";

// export async function saveAssets(
//   assets: any[]
// ) {

//   try {

//     // await db.runAsync(`DELETE FROM assets`);
//     for (const asset of assets) {

//       await db.runAsync(
//         `
//         INSERT OR REPLACE INTO assets (
//           asset_id,
//           name,
//           serial_number,
//           purchased_date,
//           warranty_period,
//           model,
//           ram_capacity,
//           storage,
//           category_id,
//           category_name,
//           status,
//           asset_condition,
//           image_url,
//           preview_url,
//           created_at,
//           updated_at
//         )

//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           asset.asset_id,
//           asset.name,
//           asset.serial_number,
//           asset.purchased_date,
//           asset.warranty_period,
//           asset.model,
//           asset.ram_capacity,
//           asset.storage,
//           asset.category_id,
//           asset.category?.name || "",
//           asset.status,
//           asset.condition,
//           asset.image_url?.replace("http://localhost","http://192.168.100.197:1010"),
//           asset.preview_url?.replace("http://localhost","http://192.168.100.197:1010"),
//           asset.created_at,
//           asset.updated_at,
//         ]
//       );
//     }

//     console.log("Assets saved");

//   } catch (error) {

//     console.log(
//       "SAVE ASSETS ERROR:",
//       error
//     );
//   }
// }

// export async function getAssets() {

//   try {

//     const result =
//       await db.getAllAsync(`
//         SELECT * FROM assets
//       `);

//     return result;

//   } catch (error) {

//     console.log(
//       "GET ASSETS ERROR:",
//       error
//     );

//     return [];
//   }
// }