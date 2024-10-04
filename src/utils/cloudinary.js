import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPhotoOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("uploading thumbnail...");

    //Uploading File to Cloudinary
    const cldnry_res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "youtube/photos",
    });

    // File Uploaded Successfully & Removing File From Local System
    fs.unlinkSync(localFilePath);
    return cldnry_res;
  } catch (error) {
    fs.unlinkSync(localFilePath); //Removing File From Local System
    console.log("CLOUDINARY :: FILE UPLOAD ERROR ", error);
    return null;
  }
};

const uploadVideoOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("uploading video...");

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(localFilePath, {
        resource_type: "video",
        folder: "videotube/videos",
        chunk_size: 6000000, // 6MB chunks
        eager: [
          {
            streaming_profile: "hd",
            format: "m3u8", // HLS format
          },
        ],
        timeout: 600000, // Increased timeout to 10 minutes
      }, (error, result) => {
        if (error) {
          console.log("CLOUDINARY :: FILE UPLOAD ERROR ", error);
          reject(error);
        } else {
          console.log("cloudinary video file", result);
          
          const hlsurl = result.eager?.[0]?.secure_url;
          
          if (!hlsurl) {
            console.log("HLS URL not found in Cloudinary response");
            reject(new Error("HLS URL not generated"));
          } else {
            resolve({ ...result, hlsurl });
          }
        }

        // Clean up local file after upload attempt
        fs.unlink(localFilePath, (unlinkError) => {
          if (unlinkError) console.log("Error deleting local file:", unlinkError);
        });
      });
    });
  } catch (error) {
    console.log("CLOUDINARY :: FILE UPLOAD ERROR ", error);
    return null;
  }
};

const deleteImageOnCloudinary = async (URL) => {
  try {
    if (!URL) return false;

    let ImageId = URL.match(
      /(?:image|video)\/upload\/v\d+\/videotube\/(photos|videos)\/(.+?)\.\w+$/
    )[2];

    console.log("deleting image from cloudinary...");

    const cldnry_res = await cloudinary.uploader.destroy(
      `videotube/photos/${ImageId}`,
      {
        resource_type: "image",
      }
    );

    return cldnry_res;
  } catch (error) {
    console.log("CLOUDINARY :: FILE Delete ERROR ", error);
    return false;
  }
};

const deleteVideoOnCloudinary = async (URL) => {
  try {
    if (!URL) return false;

    let VideoId = URL.match(
      /(?:image|video)\/upload\/v\d+\/videotube\/(photos|videos)\/(.+?)\.\w+$/
    )[2];

    console.log("deleting video from cloudinary...");

    const cldnry_res = await cloudinary.uploader.destroy(
      `videotube/videos/${VideoId}`,
      {
        resource_type: "video",
      }
    );

    return cldnry_res;
  } catch (error) {
    console.log("CLOUDINARY :: FILE Delete ERROR ", error);
    return false;
  }
};

export {
  uploadPhotoOnCloudinary,
  uploadVideoOnCloudinary,
  deleteImageOnCloudinary,
  deleteVideoOnCloudinary,
};