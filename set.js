const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0VMYTVzMFVYaVp0TTFOT0pyeVdKdkVUK0VsMlBUTjBxVCsrQlA0dHdVWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUlVBaGdjcy9vQTl3NytRUHBTR0FuUG5uQ01WZVE5THlRd244SEVSaDJnaz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJZQnBnTXJ5Y0lXUS82Y2NaUGoyTGxIbWVYTEJJS005VjdrTkUvTUcwVG5rPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlOHhLd0VvakdINWNKZkNac21aaGhPckJ3MnpYWGdqbjJoRTlyRVIvYUJNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtKRmVPMjdiVUdQRmQxYzYzNGlaTlRDb2xpNmxLOWtudEhuZG82NklCVjA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkN3bkhTU01HTGJPdHZ4UHdITTc0ZFlIeWp0OHhXNjlWdVZXbHE1VlNKV009In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMkZralkySWhZMyswNU1DYUZUb21QN2tlTHZsTUFQYWxldkNiVmRIa05rcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRWM2blFXaU5NMVV5RFZTL1RqOGZzSDNsRzVmZ3hXclZmMm82cENQeHdsZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVIVVpUUnJzSHI3bjNwZFVnZW1KRzFlall3SWh2U2p4UXNPVkx1L0FKTHltR295eFhkSzd1YmZVUExNSW1ndldrNTlsTGpFVTJ2VFJqMVFlcGVwbkNnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI1LCJhZHZTZWNyZXRLZXkiOiJQSVplNG9DaUtMYUYrOS81c3o0SkxsSzZETDNHYWIybXBXRXVpV1N4L3lRPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJ3eTFfRGZCN1RTcTAxU2dXVzBTdE9nIiwicGhvbmVJZCI6IjZjOTU0YzY4LWVmM2MtNDE0Ny1iZmY0LTA1NjIyNzIwMmM3NCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJOL2Via2NwbTVIRGFwdWZrbmVYVWdhYkhzR3M9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTkM3OVZyMUFjSGdQbjNaVmFmNkZvQi9yUGRvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkdTVDFDU1hLIiwibWUiOnsiaWQiOiI5NDcyMDgwMDM5MToyMEBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLwnZqhLvCdmoIg8J2ZsCDwnZqIIPCdmoQgPiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTjdvMlpBQkVNZkNnTHdHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMElUQnE3Y0NJY21EVDFjVFkreXNhMXRBRFAvRHpaUjFGdUtZWFA5RitnVT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiUHVJcndHL3FDbGJZTUlzbFExR3JxMEJaWGJnQWxYT01YMkhhQUZsaHd6bktjUFpOb3JmZFE5V0o2Qy9WQkNwcDRTM2JjMUdZMFMrSjRhREY3VDNpQlE9PSIsImRldmljZVNpZ25hdHVyZSI6IlJ0c0FzQ256YmdRRUt0eG5jdVhqYnFjMVd1N1dvL0l4S3dYZEVuSEttYytzL2t5N1dYUjhtQi9rd3Z5NTB4ZzdCa2RRNi9NK1VXR283dS9NTnVNekNBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3MjA4MDAzOTE6MjBAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZENFd2F1M0FpSEpnMDlYRTJQc3JHdGJRQXovdzgyVWRSYmltRnovUmZvRiJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczNjQ1MDM4OCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFLQSsifQ==',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254105915061",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
