// Import the Firebase tools we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


// --- STEP 1: PASTE YOUR FIREBASE CONFIG HERE ---
// You got this earlier from your Firebase Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyAcrfgKb1Npr0uT05-XK2rd5INfciH-Hmw",
  authDomain: "bestiwish.firebaseapp.com",
  projectId: "bestiwish",
  storageBucket: "bestiwish.firebasestorage.app",
  messagingSenderId: "626567942059",
  appId: "1:626567942059:web:9baafcdeddacf62a058cee",
  measurementId: "G-P9ZXKXS025"
};


// Initialize Firebase and the Firestore database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- STEP 2: SAVING A NEW COMMENT ---
// Look at your index.html and make sure the IDs below match your actual HTML tags
const submitBtn = document.getElementById("submit-btn"); // The ID of your submit button
const commentInput = document.getElementById("comment-input"); // The ID of your text input

// If the submit button exists on the page (like on index.html), listen for clicks
if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        const textValue = commentInput.value;
        
        // Only save if the box isn't empty
        if (textValue.trim() !== "") {
            try {
                // Save the text AND the exact timestamp to the collection
                await addDoc(collection(db, "comments"), {
                    text: textValue,
                    timestamp: serverTimestamp() // <-- CHANGED TO USE FIREBASE SERVER TIME
                });
                console.log("Comment successfully saved to database!");
                commentInput.value = ""; // Clear the input box
                window.loadMessages(); // Reload the messages to show the new one
            } catch (e) {
                console.error("Error adding comment: ", e);
            }
        }
    });
}

// --- STEP 3: LOADING THE MESSAGES ---
// We attach this to "window" so it can be called from anywhere in your HTML
window.loadMessages = async function() {
    // The ID of the div/container where comments will show up
    const messagesContainer = document.getElementById("messages-container"); 
    
    // If the container doesn't exist on this page, stop here
    if (!messagesContainer) return;

    messagesContainer.innerHTML = ""; // Clear out the old messages before loading new ones

    try {
        // Fetch all the documents inside the "comments" collection
        const querySnapshot = await getDocs(collection(db, "comments"));
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Create a new paragraph element for each comment
            const commentElement = document.createElement("p");
            commentElement.textContent = data.text; // Use the "text" field we set up
            
            // Add it to the screen
            messagesContainer.appendChild(commentElement);
        });
    } catch (e) {
        console.error("Error loading messages: ", e);
    }
};

// Automatically load the messages when the page finishes loading
window.onload = () => {
    window.loadMessages();
};
