import * as FileSystem from "expo-file-system/legacy";
import { api, API_URL } from "../api/client";
import { saveProfile } from "../database/profile.service";

export async function syncProfile(token: string) {
  try {
    const response = await api.get("/profile");
    console.log("syncproflie====",response)
    if (response.data.success) {
      const profile = response.data.data;

      let localImagePath = null;

      if (profile.preview_url) {
        const filename = `profile_${profile.id}.jpg`;
        localImagePath = FileSystem.documentDirectory + filename;

        const imageUrl = profile.preview_url.replace(
          /https?:\/\/[^/]+/,
          API_URL
        );

        await FileSystem.downloadAsync(imageUrl, localImagePath);

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