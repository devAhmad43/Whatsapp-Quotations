const express = require("express");
const router = express.Router();
const Door = require("../../models/doorsModel");
const {
  uploadFile,
  uploadVideo,
  deleteFile,
} = require("../../utils/cloudinary");

router.post("/delete_file_cloudinary", async (req, res) => {
  try {
    const { name, fileUrl, doorId } = req.body;
    const existingDoor = await Door.findOne({ _id: doorId });
    if (!existingDoor) {
      return res.status(404).json({ message: "Door not found" });
    }
    await deleteFile(fileUrl);
    existingDoor[name] = "";
    await existingDoor.save();

    res
      .status(200)
      .json({ message: "Media Deleted Succesfully", existingDoor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete Media", error: error.message });
  }
});
router.post("/add-door", async (req, res) => {
  try {
    const {
      doorNameEng,
      doorNameArb,
      latitude,
      longitude,
      gateNumber,
      doorOrigin,
      additionalInfo,
      doorImage1,
      doorImage2,
      doorImage3,
      doorImage4,
      doorVideo2,
      doorImage5,
      doorVideo,
    } = req.body;
    if (
      !doorNameEng | !doorNameArb ||
      !latitude ||
      !longitude ||
      !gateNumber ||
      !doorOrigin ||
      !additionalInfo ||
      !doorImage1
    ) {
      return res.status(400).json({ message: "invalid feilds" });
    }
    // const requiredFields = ["doorNameEng", 'doorNameArb', 'latitude', 'longitude', 'gateNumber', 'doorOrigin', 'additionalInfo', 'doorImage1',];
    // let missingFields = []
    // requiredFields.forEach(field => {
    //     if (!req.body[field]) {
    //         missingFields.push(field);
    //     }
    // });

    // if (missingFields.length > 0) {
    //     return res.status(400).json({ message: `Invalid Fields  ${missingFields.join(', ')}`, });
    // }

    const newDoor = new Door({
      doorNameEng,
      doorNameArb,
      latitude,
      longitude,
      gateNumber,
      doorOrigin,
      additionalInfo,
      doorImage1,
      doorImage2,
      doorImage3,
      doorVideo,
      doorImage4,
      doorVideo2,
      doorImage5,
    });
    await newDoor.save();
    res.status(200).json({ message: "Successfully door added", newDoor });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "failed to add doors", error: error.message });
  }
});

router.put("/:doorId/edit-door", async (req, res) => {
  try {
    const { doorId } = req.params;
    const {
      doorNameEng,
      doorNameArb,
      latitude,
      longitude,
      gateNumber,
      additionalInfo,
      doorOrigin,
      doorImage1,
      doorImage2,
      doorImage3,
      doorVideo,
      doorImage4,
      doorImage5,
      doorVideo2,
    } = req.body;
    // const { Image1, Image2, Image3, video } = req.files;

    if (!doorNameEng || !latitude || !longitude || !doorOrigin) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the door exists
    const existingDoor = await Door.findById(doorId);
    if (!existingDoor) {
      return res.status(404).json({ message: "Door not found" });
    }

    // Update door fields
    existingDoor.doorNameEng = doorNameEng;
    existingDoor.doorNameArb = doorNameArb;
    existingDoor.latitude = latitude;
    existingDoor.longitude = longitude;
    existingDoor.gateNumber = gateNumber;
    existingDoor.additionalInfo = additionalInfo;
    existingDoor.doorOrigin = doorOrigin;

    if (doorImage1) {
      await deleteFile(existingDoor.doorImage1);
      existingDoor.doorImage1 = doorImage1;
    }

    if (doorImage2) {
      await deleteFile(existingDoor.doorImage2);
      existingDoor.doorImage2 = doorImage2;
    }

    if (doorImage3) {
      await deleteFile(existingDoor.doorImage3);
      existingDoor.doorImage3 = doorImage3;
    }
    if (doorImage4) {
      await deleteFile(existingDoor.doorImage4);
      existingDoor.doorImage4 = doorImage4;
    }

    if (doorImage5) {
      await deleteFile(existingDoor.doorImage5);
      existingDoor.doorImage5 = doorImage5;
    }

    if (doorVideo) {
      await deleteFile(existingDoor.doorVideo);
      existingDoor.doorVideo = doorVideo;
    }
    if (doorVideo2) {
      await deleteFile(existingDoor.doorVideo2);
      existingDoor.doorVideo2 = doorVideo2;
    }

    // Save updated door
    await existingDoor.save();

    res
      .status(200)
      .json({
        message: "Door updated successfully",
        updatedDoor: existingDoor,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Failed to update door. Please try again later.",
        error: error.message,
      });
  }
});

router.get("/get-all-doors", async (req, res) => {
  try {
    const doors = await Door.find().sort({ _id: -1 });

    if (!doors && doors.length === 0) {
      return res.status(404).json({ message: "doors not found" });
    }

    res.status(200).json({ message: "doors fetched successfully", doors });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "failed to fetch all doors", error: error.message });
  }
});

router.delete("/:doorId/delete_door", async (req, res) => {
  const { doorId } = req.params;
  try {
    const door = await Door.findOne({ _id: doorId });

    if (!door) {
      return res.status(404).json({ message: "door not found" });
    }
    if (door.doorImage1) {
      await deleteFile(door.doorImage1);
    }
    if (door.doorImage2) {
      await deleteFile(door.doorImage2);
    }
    if (door.doorImage3) {
      await deleteFile(door.doorImage3);
    }
    if (door.doorImage4) {
      await deleteFile(door.doorImage4);
    }
    if (door.doorImage5) {
      await deleteFile(door.doorImage5);
    }
    if (door.doorVideo) {
      await deleteFile(door.doorVideo);
    }
    if (door.doorVideo2) {
      await deleteFile(door.doorVideo2);
    }
    await Door.deleteOne({ _id: doorId });
    return res.status(200).json({ message: "door deleted successfully", door });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to Delete door,", error: error.message });
  }
});

// class MakkahDoorsInfo {
// final List<DoorInfoModel> makkahDoorLocations = [
//   DoorInfoModel(
//     doorName: 'King Abdullah Gate',
//     latitude: 21.4228764,
//     longitude: 39.8231598,
//     imagePaths: [
//       'assets/images/abdullah_gate_1.jpeg',
//       'assets/images/abdullah_gate_2.jpeg'
//     ],
//     gateNumber: '100',
//     additionalInfo: 'Additional Info for Door 1',
//   ),
//   DoorInfoModel(
//     doorName: 'King Fahd Gate',
//     latitude: 21.421429078407716,
//     longitude: 39.824543035164915,
//     imagePaths: [
//       'assets/images/fahad_gate_1.jpg',
//       'assets/images/fahad_gate_2.jpg'
//     ],
//     gateNumber: '79',
//     additionalInfo: 'Additional Info for Door 1',
//   ),
//   DoorInfoModel(
//     doorName: 'King Abdul Aziz Gate',
//     latitude: 21.421408747989858,
//     longitude: 39.82627826153666,
//     gateNumber: '1',
//     imagePaths: ['assets/images/abdul_aziz_1.jpeg'],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Bab Al-Salam Gate',
//     latitude: 21.42277933267181,
//     longitude: 39.828151052564785,
//     gateNumber: '4',
//     imagePaths: [
//       'assets/images/bab_as_salam_gate_1.jpg',
//       'assets/images/bab_as_salam_gate_2.jpg'
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Bab Al-Marwa Gate',
//     latitude: 21.4214764,
//     longitude: 39.8221598,
//     gateNumber: '23',
//     imagePaths: [
//       'assets/images/al_marwa_gate_1.jpg',
//       'assets/images/al_marwa_gate_2.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Bab Jiyad Gate',
//     latitude: 21.4204764,
//     longitude: 39.8206598,
//     gateNumber: '5',
//     imagePaths: [
//       'assets/images/jiyyad_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Bab Al Umrah',
//     latitude: 21.42293430252019,
//     longitude: 39.825004411033454,
//     gateNumber: '40',
//     imagePaths: [
//       'assets/images/umrah_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Bab Al-Fatah',
//     latitude: 21.42410425752414,
//     longitude: 39.82681844317674,
//     gateNumber: '45',
//     imagePaths: [
//       'assets/images/fatah_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   // Add more locations as needed
// ];

// final List<DoorInfoModel> madinaDoorLocations = [
//   DoorInfoModel(
//     doorName: 'Bab as-Salam (Essalam Gate)',
//     latitude: 24.468189915667654,
//     longitude: 39.61271073883695,
//     imagePaths: [
//       'assets/images/salam_madina_gate_1.jpg',
//     ],
//     gateNumber: '1',
//     additionalInfo: 'Additional Info for Door 1',
//   ),
//   DoorInfoModel(
//     doorName: 'Jebril Gate',
//     latitude: 24.46844864817047,
//     longitude: 39.61254977064101,
//     imagePaths: [
//       'assets/images/jebril_gate_1.jpg',
//     ],
//     gateNumber: '40',
//     additionalInfo: 'Additional Info for Door 1',
//   ),
//   DoorInfoModel(
//     doorName: 'Badr Gate',
//     latitude: 24.47063856185981,
//     longitude: 39.61216351610631,
//     gateNumber: '69',
//     imagePaths: ['assets/images/bab_badr_gate_1.jpg'],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Omar Bin Khattab Gate',
//     latitude: 24.470448138320283,
//     longitude: 39.61085197064237,
//     gateNumber: '18',
//     imagePaths: [
//       'assets/images/umar_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'King Fahd Gate',
//     latitude: 24.470655601107186,
//     longitude: 39.614086676351405,
//     gateNumber: '20, 21, 22',
//     imagePaths: [
//       'assets/images/fahad_madina_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Usman Bin Affan Gate',
//     latitude: 24.470465198884373,
//     longitude: 39.6155135530589,
//     gateNumber: '24, 25, 26',
//     imagePaths: [
//       'assets/images/usman_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Ohud Gate',
//     latitude: 24.470587301510538,
//     longitude: 39.61426102293633,
//     gateNumber: '23',
//     imagePaths: [
//       'assets/images/ohud_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Ali Bin Abi-Talib Gate',
//     latitude: 24.470318763847615,
//     longitude: 39.61486446213065,
//     gateNumber: '28, 29, 30',
//     imagePaths: [
//       'assets/images/abi_talib_gate_1.jpeg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Abu Dhar Al Ghifari Gate',
//     latitude: 24.46974493930915,
//     longitude: 39.61612250703378,
//     gateNumber: '31, 32',
//     imagePaths: [
//       'assets/images/al_ghafari_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'King Abdul Aziz Gate',
//     latitude: 24.469012688532626,
//     longitude: 39.61695391386348,
//     gateNumber: '33, 34, 35',
//     imagePaths: [
//       'assets/images/aziz_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Makkah Gate',
//     latitude: 24.46844506895207,
//     longitude: 39.6138023393977,
//     gateNumber: '37',
//     imagePaths: [
//       'assets/images/makkah_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Bilal Gate',
//     latitude: 24.4683901466424,
//     longitude: 39.612922593373185,
//     gateNumber: '38',
//     imagePaths: [
//       'assets/images/bilal_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Bab al-Nisa',
//     latitude: 24.467779259945782,
//     longitude: 39.6116633634561,
//     gateNumber: '39',
//     imagePaths: [
//       'assets/images/nisa_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'Al Baqia Gate\t\tباب البقيع',
//     latitude: 24.467489099648073,
//     longitude: 39.61155326513322,
//     gateNumber: '41',
//     imagePaths: [
//       'assets/images/baki_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Essalam Gate',
//     latitude: 24.46811179329349,
//     longitude: 39.61266782349546,
//     gateNumber: '1',
//     imagePaths: [
//       'assets/images/salam_madina_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Al Hijrah Gate\t\tباب الهجرة',
//     latitude: 24.468580552082564,
//     longitude: 39.6119167393977,
//     gateNumber: '4',
//     imagePaths: [
//       'assets/images/hijra_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Abu Bakr Siddiq Gate',
//     latitude: 24.46829484232614,
//     longitude: 39.61295473088606,
//     gateNumber: '2',
//     imagePaths: [
//       'assets/images/abubakr_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Al Rahma Gate\t\tباب الرحمة',
//     latitude: 24.46836816931071,
//     longitude: 39.61191676269009,
//     gateNumber: '3',
//     imagePaths: [
//       'assets/images/rehma_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Quba Gate\t\tباب قباء',
//     latitude: 24.468600113245436,
//     longitude: 39.61154661610519,
//     gateNumber: '37',
//     imagePaths: [
//       'assets/images/quba_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),
//   DoorInfoModel(
//     doorName: 'King Saud Gate\t\tباب الملك سعود',
//     latitude: 24.4689687276312,
//     longitude: 39.61060782405644,
//     gateNumber: '7, 8, 9',
//     imagePaths: [
//       'assets/images/saud_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Imam Al Bukhari Gate',
//     latitude: 24.46872316315713,
//     longitude: 39.609265978002306,
//     gateNumber: '10',
//     imagePaths: [
//       'assets/images/bukhari_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

//   DoorInfoModel(
//     doorName: 'Al Aqiq Gate',
//     latitude: 24.46894045071373,
//     longitude: 39.60920399234654,
//     gateNumber: '11',
//     imagePaths: [
//       'assets/images/aqiq_gate_1.jpg',
//     ],
//     additionalInfo: 'Additional Info for Door 2',
//   ),

// Add more locations as needed
// ];

//     final List<DoorInfoModel> overviewdoors = [
//       DoorInfoModel(
//         doorName: 'Bab as-Salam (Essalam Gate)',
//         latitude: 24.468189915667654,
//         longitude: 39.61271073883695,
//         imagePaths: [
//           'assets/images/salam_madina_gate_1.jpg',
//         ],
//         gateNumber: '1',
//         additionalInfo: 'Additional Info for Door 1',
//       ),
//       DoorInfoModel(
//         doorName: 'Jebril Gate',
//         latitude: 24.46844864817047,
//         longitude: 39.61254977064101,
//         imagePaths: [
//           'assets/images/jebril_gate_1.jpg',
//         ],
//         gateNumber: '40',
//         additionalInfo: 'Additional Info for Door 1',
//       ),
//       DoorInfoModel(
//         doorName: 'Badr Gate',
//         latitude: 24.47063856185981,
//         longitude: 39.61216351610631,
//         gateNumber: '69',
//         imagePaths: ['assets/images/bab_badr_gate_1.jpg'],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Omar Bin Khattab Gate',
//         latitude: 24.470448138320283,
//         longitude: 39.61085197064237,
//         gateNumber: '18',
//         imagePaths: [
//           'assets/images/umar_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'King Fahd Gate',
//         latitude: 24.470655601107186,
//         longitude: 39.614086676351405,
//         gateNumber: '20, 21, 22',
//         imagePaths: [
//           'assets/images/fahad_madina_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Usman Bin Affan Gate',
//         latitude: 24.470465198884373,
//         longitude: 39.6155135530589,
//         gateNumber: '24, 25, 26',
//         imagePaths: [
//           'assets/images/usman_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Ohud Gate',
//         latitude: 24.470587301510538,
//         longitude: 39.61426102293633,
//         gateNumber: '23',
//         imagePaths: [
//           'assets/images/ohud_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Ali Bin Abi-Talib Gate',
//         latitude: 24.470318763847615,
//         longitude: 39.61486446213065,
//         gateNumber: '28, 29, 30',
//         imagePaths: [
//           'assets/images/abi_talib_gate_1.jpeg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Abu Dhar Al Ghifari Gate',
//         latitude: 24.46974493930915,
//         longitude: 39.61612250703378,
//         gateNumber: '31, 32',
//         imagePaths: [
//           'assets/images/al_ghafari_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'King Abdul Aziz Gate',
//         latitude: 24.469012688532626,
//         longitude: 39.61695391386348,
//         gateNumber: '33, 34, 35',
//         imagePaths: [
//           'assets/images/aziz_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Makkah Gate',
//         latitude: 24.46844506895207,
//         longitude: 39.6138023393977,
//         gateNumber: '37',
//         imagePaths: [
//           'assets/images/makkah_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Bilal Gate',
//         latitude: 24.4683901466424,
//         longitude: 39.612922593373185,
//         gateNumber: '38',
//         imagePaths: [
//           'assets/images/bilal_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Bab al-Nisa',
//         latitude: 24.467779259945782,
//         longitude: 39.6116633634561,
//         gateNumber: '39',
//         imagePaths: [
//           'assets/images/nisa_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Al Baqia Gate\t\tباب البقيع',
//         latitude: 24.467489099648073,
//         longitude: 39.61155326513322,
//         gateNumber: '41',
//         imagePaths: [
//           'assets/images/baki_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Essalam Gate',
//         latitude: 24.46811179329349,
//         longitude: 39.61266782349546,
//         gateNumber: '1',
//         imagePaths: [
//           'assets/images/salam_madina_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Al Hijrah Gate\t\tباب الهجرة',
//         latitude: 24.468580552082564,
//         longitude: 39.6119167393977,
//         gateNumber: '4',
//         imagePaths: [
//           'assets/images/hijra_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Abu Bakr Siddiq Gate',
//         latitude: 24.46829484232614,
//         longitude: 39.61295473088606,
//         gateNumber: '2',
//         imagePaths: [
//           'assets/images/abubakr_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Al Rahma Gate\t\tباب الرحمة',
//         latitude: 24.46836816931071,
//         longitude: 39.61191676269009,
//         gateNumber: '3',
//         imagePaths: [
//           'assets/images/rehma_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Quba Gate\t\tباب قباء',
//         latitude: 24.468600113245436,
//         longitude: 39.61154661610519,
//         gateNumber: '37',
//         imagePaths: [
//           'assets/images/quba_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'King Saud Gate\t\tباب الملك سعود',
//         latitude: 24.4689687276312,
//         longitude: 39.61060782405644,
//         gateNumber: '7, 8, 9',
//         imagePaths: [
//           'assets/images/saud_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Imam Al Bukhari Gate',
//         latitude: 24.46872316315713,
//         longitude: 39.609265978002306,
//         gateNumber: '10',
//         imagePaths: [
//           'assets/images/bukhari_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Al Aqiq Gate',
//         latitude: 24.46894045071373,
//         longitude: 39.60920399234654,
//         gateNumber: '11',
//         imagePaths: [
//           'assets/images/aqiq_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'King Abdullah Gate',
//         latitude: 21.4228764,
//         longitude: 39.8231598,
//         imagePaths: [
//           'assets/images/abdullah_gate_1.jpeg',
//           'assets/images/abdullah_gate_2.jpeg'
//         ],
//         gateNumber: '100',
//         additionalInfo: 'Additional Info for Door 1',
//       ),
//       DoorInfoModel(
//         doorName: 'King Fahd Gate',
//         latitude: 21.421429078407716,
//         longitude: 39.824543035164915,
//         imagePaths: [
//           'assets/images/fahad_gate_1.jpg',
//           'assets/images/fahad_gate_2.jpg'
//         ],
//         gateNumber: '79',
//         additionalInfo: 'Additional Info for Door 1',
//       ),
//       DoorInfoModel(
//         doorName: 'King Abdul Aziz Gate',
//         latitude: 21.421408747989858,
//         longitude: 39.82627826153666,
//         gateNumber: '1',
//         imagePaths: ['assets/images/abdul_aziz_1.jpeg'],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Bab Al-Salam Gate',
//         latitude: 21.42277933267181,
//         longitude: 39.828151052564785,
//         gateNumber: '4',
//         imagePaths: [
//           'assets/images/bab_as_salam_gate_1.jpg',
//           'assets/images/bab_as_salam_gate_2.jpg'
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Bab Al-Marwa Gate',
//         latitude: 21.4214764,
//         longitude: 39.8221598,
//         gateNumber: '23',
//         imagePaths: [
//           'assets/images/al_marwa_gate_1.jpg',
//           'assets/images/al_marwa_gate_2.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Bab Jiyad Gate',
//         latitude: 21.4204764,
//         longitude: 39.8206598,
//         gateNumber: '5',
//         imagePaths: [
//           'assets/images/jiyyad_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       DoorInfoModel(
//         doorName: 'Bab Al Umrah',
//         latitude: 21.42293430252019,
//         longitude: 39.825004411033454,
//         gateNumber: '40',
//         imagePaths: [
//           'assets/images/umrah_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),

//       DoorInfoModel(
//         doorName: 'Bab Al-Fatah',
//         latitude: 21.42410425752414,
//         longitude: 39.82681844317674,
//         gateNumber: '45',
//         imagePaths: [
//           'assets/images/fatah_gate_1.jpg',
//         ],
//         additionalInfo: 'Additional Info for Door 2',
//       ),
//       // Add more locations as needed
//     ];
//   }

module.exports = router;
