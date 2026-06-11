import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const submitBtn = document.getElementById("submit-btn"); 
const commentInput = document.getElementById("comment-input"); 

if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        const textValue = commentInput.value;
        const currentRating = window.siteRating || null;
        
        // 1. Safely copy media data into arrays to keep track of them before UI goes blank
        const currentImages = window.attachedImages ? [...window.attachedImages] : [];
        const currentAudio = window.voiceAudioBase64 ? window.voiceAudioBase64 : null;
        
        if (textValue.trim() !== "" || currentImages.length > 0 || currentAudio !== null) {
            
            const statusDiv = document.getElementById("comment-status");
            if(statusDiv) {
                statusDiv.style.display = "block";
                statusDiv.innerText = "Uploading your message safely... ✨";
            }

            // 2. IMMEDIATELY CLEAR THE UI AND INPUTS (Solves the issue where it visually stays stuck)
            if (commentInput) commentInput.value = ""; 
            window.attachedImages = [];
            window.voiceAudioBase64 = null;

            const mediaPreview = document.getElementById('media-preview-area');
            if (mediaPreview) mediaPreview.innerHTML = "";
            
            const voiceUi = document.getElementById('voice-recording-ui');
            if (voiceUi) voiceUi.style.display = 'none';
            
            if (commentInput) commentInput.style.display = 'block';

            const audioPlayback = document.getElementById('audio-playback');
            if (audioPlayback) {
                audioPlayback.pause();
                audioPlayback.src = "";
                audioPlayback.style.display = "none";
            }
            
            const camInput = document.getElementById("camera-input");
            if(camInput) camInput.value = "";
            const galInput = document.getElementById("gallery-input");
            if(galInput) galInput.value = "";

            try {
                // 3. Send the copied payloads safely to the Database
                await addDoc(collection(db, "comments"), {
                    text: textValue,
                    rating: currentRating,
                    images: currentImages,
                    audio: currentAudio,
                    timestamp: serverTimestamp() 
                });
                
                console.log("Full data package successfully saved to database!");
                
                if(statusDiv) statusDiv.innerText = "Message Delivered Successfully! 💖";
                setTimeout(() => { if(statusDiv) statusDiv.style.display = "none"; }, 3000);

                if(window.loadMessages) window.loadMessages(); 
            } catch (e) {
                console.error("Error adding comment: ", e);
                if(statusDiv) statusDiv.innerText = "Something went wrong! Please try again.";
            }
        }
    });
}

// Custom listener ensuring that any time the rating is clicked, it sends a payload directly to Admin Panel!
window.addEventListener('ratingSubmitted', async (e) => {
    const ratingValue = e.detail;
    try {
        await addDoc(collection(db, "comments"), {
            text: "User left a rating! 🌟",
            rating: ratingValue,
            images: [],
            audio: null,
            timestamp: serverTimestamp()
        });
        console.log("Rating auto-sent successfully to admin panel!");
    } catch (error) {
        console.error("Error sending rating:", error);
    }
});

window.loadMessages = async function() {
    const messagesContainer = document.getElementById("messages-container"); 
    if (!messagesContainer) return;
    messagesContainer.innerHTML = ""; 

    try {
        const querySnapshot = await getDocs(collection(db, "comments"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const commentElement = document.createElement("p");
            commentElement.textContent = data.text; 
            messagesContainer.appendChild(commentElement);
        });
    } catch (e) {
        console.error("Error loading messages: ", e);
    }
};

window.onload = () => {
    window.loadMessages();
};
