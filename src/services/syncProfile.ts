// import { api } from "../api/client";
import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import { saveProfile } from "../database/profile.service";

export async function syncProfile(token: string) {
  try {
    const response = await axios.get(
      "http://192.168.100.183:1011/api/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      const profile = response.data.data;

      let localImagePath = null;

      if (profile.preview_url) {
        const filename = `profile_${profile.id}.jpg`;

        localImagePath =
          FileSystem.documentDirectory +
          filename;

        await FileSystem.downloadAsync(
          profile.preview_url,
          localImagePath
        );

        console.log(
          "IMAGE SAVED:",
          localImagePath
        );
      }

      await saveProfile({
        ...profile,
        local_image_path: localImagePath,
      });
    }
  } catch (error) {
    console.log("SYNC PROFILE ERROR:", error);
  }
}