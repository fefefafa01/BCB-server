/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db/index");

// router.get("/", async (req, res) => {
// 	const notifData = await db.query(`Select * from notification order by notification_id asc`);
// 	if (notifData.length > 0) {
// 		res.json({ notifData: notifData });
// 		console.log("Notification found");
// 	} else {
// 		console.log("No notification");
// 	}
// });

// module.exports = router;

router.get("/", async (req, res) => {
    let { data: notifData, error } = await db
        .from('notification')
        .select('*');
        
    if (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: error.message });
    }

    if (notifData && notifData.length > 0) {
        res.json({ notifData });
        console.log("Notification found");
    } else {
        res.json({ notifData: [] });
        console.log("No notification");
    }
});

module.exports = router;
