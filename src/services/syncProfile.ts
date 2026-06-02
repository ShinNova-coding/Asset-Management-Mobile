// import { api } from "../api/client";
import axios from "axios";
import { saveProfile } from "../database/profile.service";


export async function syncProfile(token: string) {
  try {
    const response = await axios.get(
      "http://192.168.100.185:1010/api/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

     console.log( "FULL PROFILE RESPONSE:",JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      await saveProfile(response.data.data);  
      console.log( "Profile synced successfully");
      console.log("PROFILE RESPONSE:",JSON.stringify(response.data, null, 2)
);
    }
  } 
    
   catch (error) {

    console.log(
      "SYNC PROFILE ERROR:",
      error
    );
  }
}