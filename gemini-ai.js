// gemini-ai.js
const API_KEY = "AQ.Ab8RN6KAR8wnc4QulWdHhfXN4D8xXLLlBN-qYYwhPWkude83kQ";

const chatMessages = document.getElementById('chat-messages');
const aiInput = document.getElementById('ai-input');
const aiSendBtn = document.getElementById('ai-send');
const toggleChatBtn = document.getElementById('toggle-chat-btn');
const aiChatContainer = document.getElementById('ai-chat-container');

// Toggle chat window visibility
toggleChatBtn.addEventListener('click', () => {
    if (aiChatContainer.style.display === 'none' || aiChatContainer.style.display === '') {
        aiChatContainer.style.display = 'flex';
        toggleChatBtn.innerText = "🔽 Close AI Assistant";
    } else {
        aiChatContainer.style.display = 'none';
        toggleChatBtn.innerText = "💬 Talk to my AI Assistant";
    }
});

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '8px';
    msgDiv.style.fontSize = '0.9rem';
    msgDiv.style.lineHeight = '1.4';
    
    if (sender === 'You') {
        msgDiv.innerHTML = `<strong style="color: #554448;">You:</strong> <span style="background: #FFE5EC; padding: 4px 8px; border-radius: 8px; display: inline-block;">${text}</span>`;
        msgDiv.style.textAlign = 'right';
    } else {
        msgDiv.innerHTML = `<strong style="color: #D9386A;">AI:</strong> <span style="background: #fdfdfd; border: 1px solid #FFB6C1; padding: 4px 8px; border-radius: 8px; display: inline-block;">${text}</span>`;
        msgDiv.style.textAlign = 'left';
    }
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv; // Return element in case we need to update it (e.g. "Typing...")
}

aiSendBtn.addEventListener('click', async () => {
    const userMessage = aiInput.value.trim();
    if (!userMessage) return;

    // 1. Display User Message
    appendMessage('You', userMessage);
    aiInput.value = '';
    aiSendBtn.disabled = true;

    // 2. Display Loading State
    const loadingDiv = appendMessage('AI', 'Typing a sweet reply... ✨');

    // 3. Prompt Gemini
    const prompt = `You are a sweet, encouraging, and supportive AI assistant embedded in a birthday surprise website built by a loving best friend. The user is the birthday girl. Respond to her in easy, simple English. Keep it short, very sweet, and positive. The user just said: "${userMessage}"`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const aiReplyText = data.candidates[0].content.parts[0].text;

        // Update loading text with actual reply
        loadingDiv.innerHTML = `<strong style="color: #D9386A;">AI:</strong> <span style="background: #fdfdfd; border: 1px solid #FFB6C1; padding: 4px 8px; border-radius: 8px; display: inline-block;">${aiReplyText}</span>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 4. Send the log to Firebase via Custom Event
        window.dispatchEvent(new CustomEvent('aiChatSubmitted', { 
            detail: { userMsg: userMessage, aiReply: aiReplyText } 
        }));

    } catch (e) {
        console.error("AI Error:", e);
        loadingDiv.innerHTML = `<strong style="color: #D9386A;">AI:</strong> <span style="background: #fdfdfd; border: 1px solid #FFB6C1; padding: 4px 8px; border-radius: 8px; display: inline-block;">I'm here for you, but my connection is a little sleepy right now! 💕</span>`;
    } finally {
        aiSendBtn.disabled = false;
    }
});
