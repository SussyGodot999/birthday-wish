import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcrfgKb1Npr0uT05-XK2rd5INfciH-Hmw",
  authDomain: "bestiwish.firebaseapp.com",
  projectId: "bestiwish",
  storageBucket: "bestiwish.firebasestorage.app",
  messagingSenderId: "626567942059",
  appId: "1:626567942059:web:9baafcdeddacf62a058cee",
  measurementId: "G-P9ZXKXS025"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Send Text Message
const submitBtn = document.getElementById("submit-btn"); 
const commentInput = document.getElementById("comment-input"); 

if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        const textValue = commentInput.value.trim();
        
        if (textValue !== "") {
            const statusDiv = document.getElementById("comment-status");
            if(statusDiv) {
                statusDiv.style.display = "block";
                statusDiv.innerText = "Uploading your message safely... ✨";
            }

            try {
                // Save specifically as a "message" type document
                await addDoc(collection(db, "comments"), {
                    type: "message",
                    text: textValue,
                    timestamp: serverTimestamp() 
                });
                
                commentInput.value = ""; 

                if(statusDiv) statusDiv.innerText = "Message Delivered Successfully! 💖";
                setTimeout(() => { if(statusDiv) statusDiv.style.display = "none"; }, 3000);

            } catch (e) {
                console.error("Error adding message: ", e);
                if(statusDiv) statusDiv.innerText = "Something went wrong! Please try again.";
            }
        }
    });
}

// 2. Send Rating Separately and Instantly
window.addEventListener('ratingSubmitted', async (e) => {
    const ratingValue = e.detail;
    try {
        // Save specifically as a "rating" type document
        await addDoc(collection(db, "comments"), {
            type: "rating",
            rating: ratingValue,
            timestamp: serverTimestamp()
        });
        console.log("Rating securely saved to database!");
    } catch (error) {
        console.error("Error saving rating: ", error);
    }
});
