/** @format */

const express = require("express");
const router = express.Router();
const db = require("../db/index");

// router.get("/", async (req, res) => {
// 	const notifData = await db.query(`Select * from news order by news_id asc`);
// 	if (notifData.length > 0) {
// 		res.json({ bangTinData: notifData });
// 		console.log("Bang Tin found");
// 	} else {
// 		console.log("No Bang Tin");
// 	}
// });

// module.exports = router;

router.get("/", async (req, res) => {
    const { data: notifData, error } = await db
        .from('news')
        .select('*')
        .order('news_id', { ascending: true });

    if (error) {
        console.error("Error fetching news:", error);
        return res.status(500).json({ error: error.message });
    }

    if (notifData && notifData.length > 0) {
        res.json({ bangTinData: notifData });
        console.log("Bang Tin found");
    } else {
        res.json({ bangTinData: [] });
        console.log("No Bang Tin");
    }
});

module.exports = router;
