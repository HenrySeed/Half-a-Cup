const admin = require('firebase-admin');
const serviceAccount = require("../../keys/service-key.json");


// set up firebase link for download
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
});
const firestore = admin.firestore();
firestore.settings({timestampsInSnapshots: true});


let str = "[";

// get all recipes, 
admin.firestore().collection("recipes").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        str += JSON.stringify(doc.data()) + ', '
    });

    // trim the last ","
    str = str.slice(0, str.length-2);
    str += "]"

    console.log(str);
});

