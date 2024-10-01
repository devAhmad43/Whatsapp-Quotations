const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// cloudinary.config({
//     cloud_name: 'da6yuh11g',
//     api_key: '494944818615485',
//     api_secret: 'F7LNl8wJLBt6i2pB-2WRB1GyLj0',
//     secure: true,
// });
cloudinary.config({
    cloud_name: 'dh61apvbf',
    api_key: '536939129243576',
    api_secret: '6spzcKIPx4F1filEP8Sq9j9mOuA',
    secure: true,
});
const uploadFile = async (path, folderName) => {

    if (path) {
        try {
            const result = await cloudinary.uploader.upload(path, {
                folder: folderName,
                // resource_type: 'video', 
            });

            const deletePromise = new Promise((resolve, reject) => {
                fs.unlink(path, (err) => {
                    if (err) {
                        reject(err); // Reject the promise on error
                    } else {
                        resolve(); // Resolve the promise on success
                    }
                });
            });

            await deletePromise;
            return result.url;
        } catch (error) {
            console.error(error);
            return null
        }
    }

    return null;
};
const uploadVideo = async (path, folderName) => {

    if (path) {
        try {
            const result = await cloudinary.uploader.upload(path, {
                folder: folderName,
                resource_type: 'video',
            });

            const deletePromise = new Promise((resolve, reject) => {
                fs.unlink(path, (err) => {
                    if (err) {
                        reject(err); // Reject the promise on error
                    } else {
                        resolve(); // Resolve the promise on success
                    }
                });
            });

            await deletePromise; 
            return result.url;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    return null;
};


const deleteFile = async (url) => {
    try {
        // Extract public_id from the URL
        const public_id = url.split('/').slice(-2).join('/').split('.')[0];
        // console.log(url)
        console.log(public_id)
        // Delete the image from Cloudinary
        const Cresult = await cloudinary.uploader.destroy(public_id);
        console.log(Cresult)
        // Check the result and return a boolean indicating success or failure
        return Cresult.result === 'ok';
       
    } catch (error) {
        console.error(error);
        return false;
    }
};
// const updateImage = async (path,url) => {
//     const public_id = url.split('/').slice(-3).join('/').replace(/\..+$/, '');
//     try {
//         const result = await cloudinary.uploader.upload(path, {
//             public_id: public_id,
//             folder: 'brightstar',
//         });

//         return result.url;
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }


module.exports = { uploadVideo, uploadFile, deleteFile };