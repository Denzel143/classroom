// EduClass runtime configuration for native/WebView.
// WARNING: everything in this file is readable by the client. Restrict credentials accordingly.
export const APP_CONFIG = {
  firebase: {
  "apiKey": "AIzaSyDJr-6PSzrDEC7J9XfI38g3C_r65x9OlLA",
  "authDomain": "public-database-e58ab.firebaseapp.com",
  "databaseURL": "https://public-database-e58ab-default-rtdb.firebaseio.com",
  "projectId": "public-database-e58ab",
  "storageBucket": "public-database-e58ab.firebasestorage.app",
  "messagingSenderId": "595860953738",
  "appId": "1:595860953738:web:d0ad19f96351191137ab73",
  "measurementId": "G-QCYP5Y72J8"
},
  storj: {
  "accessKey": "jug7ovmaijdhyk6g3rhbz5ekjsbq",
  "secretKey": "jy2nilecdpvurkaum2x4gtpshb2e6nadluaro7ngibzsgosw25jps",
  "endpoint": "https://gateway.storjshare.io",
  "bucket": "my-educlass-bucket",
  "region": "us-east-1"
},
  eduai: {
    // direct = native/WebView -> Gemini directly
    // proxy = web deployment -> /api/eduai
    mode: "direct",
    apiKey: "AQ.Ab8RN6JfILO_C-nftEoJewONChuioPS7hvdyb88XoeDjEHhrsw",
    endpoint: "https://generativelanguage.googleapis.com/v1beta",
    model: "gemini-flash-lite-latest",
    temperature: 0.7,
    maxOutputTokens: 1024,
    proxyEndpoint: "/api/eduai"
  }
};
