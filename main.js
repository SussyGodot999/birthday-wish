// main.js
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

// 2. Send Rating
window.addEventListener('ratingSubmitted', async (e) => {
    try {
        await addDoc(collection(db, "comments"), {
            type: "rating",
            rating: e.detail,
            timestamp: serverTimestamp()
        });
        console.log("Rating saved!");
    } catch (error) { console.error("Error saving rating: ", error); }
});

// 3. Send Questionnaire Answers (NEW)
window.addEventListener('questionnaireSubmitted', async (e) => {
    try {
        await addDoc(collection(db, "comments"), {
            type: "questionnaire",
            answers: e.detail, // Array of {question, answer}
            timestamp: serverTimestamp()
        });
        console.log("Questionnaire saved!");
    } catch (error) { console.error("Error saving questionnaire: ", error); }
});

// 4. Send AI Chat Logs (NEW)
window.addEventListener('aiChatSubmitted', async (e) => {
    try {
        await addDoc(collection(db, "comments"), {
            type: "ai_chat",
            userMessage: e.detail.userMsg,
            aiReply: e.detail.aiReply,
            timestamp: serverTimestamp()
        });
        console.log("AI Chat saved!");
    } catch (error) { console.error("Error saving AI Chat: ", error); }
});
