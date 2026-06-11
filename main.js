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
        const currentImages = window.attachedImages || [];
        const currentAudio = window.voiceAudioBase64 || null;
        
        // Save if text isn't empty, or if an image or audio is attached
        if (textValue.trim() !== "" || currentImages.length > 0 || currentAudio !== null) {
            
            // Show loading status
            const statusDiv = document.getElementById("comment-status");
            if(statusDiv) {
                statusDiv.style.display = "block";
                statusDiv.innerText = "Uploading your message safely... ✨";
            }

            try {
                await addDoc(collection(db, "comments"), {
                    text: textValue,
                    rating: currentRating,
                    images: currentImages,
                    audio: currentAudio,
                    timestamp: serverTimestamp() 
                });
                
                console.log("Full data package successfully saved to database!");
                
                // Clear inputs after successful send
                commentInput.value = ""; 
                window.siteRating = null;
                window.attachedImages = [];
                window.voiceAudioBase64 = null;

                // Reset UI inside index.html visually
                const ratingText = document.getElementById('rating-text');
                if (ratingText) ratingText.innerText = "Rate me!";
                document.querySelectorAll('.stars span').forEach(s => s.classList.remove('active'));
                document.getElementById('media-preview-area').innerHTML = "";
                document.getElementById('voice-recording-ui').style.display = 'none';
                document.getElementById('comment-input').style.display = 'block';

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
            try {
                await addDoc(collection(db, "comments"), {
                    text: textValue,
                    rating: currentRating,
                    images: currentImages,
                    audio: currentAudio,
                    timestamp: serverTimestamp() 
                });
                
                console.log("Full data package successfully saved to database!");
                
                // Clear inputs after successful send
                commentInput.value = ""; 
                window.siteRating = null;
                window.attachedImages = [];
                window.voiceAudioBase64 = null;

                // Reset UI inside index.html visually
                const ratingText = document.getElementById('rating-text');
                if (ratingText) ratingText.innerText = "Rate me!";
                document.querySelectorAll('.stars span').forEach(s => s.classList.remove('active'));
                document.getElementById('media-preview-area').innerHTML = "";
                document.getElementById('voice-recording-ui').style.display = 'none';
                document.getElementById('comment-input').style.display = 'block';

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
