const admin = require('firebase-admin');
const serviceAccount = require("../keys/service-key.json");

const data = require("./allRecipes.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
});
const firestore = admin.firestore();
firestore.settings({timestampsInSnapshots: true});
 
for(const recipe of Array.from(data)){
    const name = recipe.title.replace(/ /g, '_');

    if (typeof recipe === "object") {

        admin.firestore().collection("recipes")
            .doc(name)
            .set(recipe)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }
}
